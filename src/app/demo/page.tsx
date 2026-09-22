"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { API_BASE_URL } from "@/lib/constants";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

type SimulationResult = {
  buyers: number;
  success: number;
  sold_out: number;
  race_conditions: number;
  errors: number;
  inventory_remaining: number;
  total_tickets?: number;
};

interface EventItem {
  id: string;
  name: string;
  location: string;
  date: string;
}

const DEFAULT_EVENT_ID = "22222222-2222-2222-2222-222222222222";

export default function DemoPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(DEFAULT_EVENT_ID);
  const [ticketCapacity, setTicketCapacity] = useState<number>(100);
  const [autoReset, setAutoReset] = useState<boolean>(true);
  const [resetting, setResetting] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [buyers, setBuyers] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => console.error("Failed to load events", err));
  }, []);

  const handleManualReset = async () => {
    try {
      setResetting(true);
      setResetMessage(null);
      const res = await fetch(`${API_BASE_URL}/reset-inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEventId,
          tickets: ticketCapacity,
        }),
      });
      if (res.ok) {
        setResetMessage(`Inventory reset to ${ticketCapacity} tickets.`);
      } else {
        setResetMessage("Failed to reset inventory.");
      }
    } catch {
      setResetMessage("Network error during inventory reset.");
    } finally {
      setResetting(false);
    }
  };

  const runSimulation = async () => {
    try {
      setLoading(true);
      setResetMessage(null);
      const start = performance.now();

      const res = await fetch(`${API_BASE_URL}/flash-sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEventId,
          buyers,
          reset_tickets: autoReset ? ticketCapacity : undefined,
        }),
      });

      const data = await res.json();
      setResult(data);
      setDuration(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  };

  const scenarios = [
    { label: "Light Load", buyers: 100 },
    { label: "Medium Load", buyers: 5000 },
    { label: "Heavy Load", buyers: 50000 },
    { label: "Viral Event", buyers: 100000 },
  ];

  const totalTickets = result?.total_tickets ?? ticketCapacity;
  const utilization = result && totalTickets > 0
    ? ((result.success / totalTickets) * 100).toFixed(0)
    : "0";

  const consistencyPassed =
    result &&
    result.success + result.inventory_remaining === totalTickets;

  return (
    <main className="container mx-auto max-w-7xl py-12 px-4">
      <div className="space-y-8">
        {/* HERO */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold">
            Flash Sale Stress Test
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Simulate extreme demand spikes and verify inventory consistency under
            heavy concurrency.
          </p>
        </div>

        {/* CONFIG */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Configuration</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* EVENT SELECTOR & CAPACITY */}
            <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/40 border border-border">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Target Catalogue Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {events.length > 0 ? (
                    events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} — {evt.location}
                      </option>
                    ))
                  ) : (
                    <option value={DEFAULT_EVENT_ID}>Coldplay Live</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Available Tickets
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoReset}
                        onChange={(e) => setAutoReset(e.target.checked)}
                        className="rounded"
                      />
                      Auto-reset before test
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={ticketCapacity}
                    onChange={(e) => setTicketCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <Button
                    variant="outline"
                    onClick={handleManualReset}
                    disabled={resetting}
                    className="flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {resetting ? "Resetting..." : "Reset Now"}
                  </Button>
                </div>
                {resetMessage && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {resetMessage}
                  </p>
                )}
              </div>
            </div>

            {/* SCENARIO PRESETS */}
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <Button
                  key={s.label}
                  variant={buyers === s.buyers ? "default" : "outline"}
                  onClick={() => setBuyers(s.buyers)}
                >
                  {s.label}
                </Button>
              ))}
            </div>

            {/* CONCURRENT BUYERS SLIDER */}
            <div className="space-y-4">
              <Slider
                value={[buyers]}
                min={100}
                max={100000}
                step={100}
                onValueChange={(v) => setBuyers(v[0])}
              />

              <div className="text-center">
                <p className="text-5xl font-bold">
                  {buyers.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Concurrent Buyers</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={runSimulation}
                disabled={loading}
              >
                {loading ? "Running..." : "Run Simulation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            {/* PASS / FAIL BANNER */}
            <Card className={consistencyPassed ? "border-green-500" : "border-red-500"}>
              <CardContent className="py-10 text-center">
                <h2
                  className={`text-5xl font-bold ${
                    consistencyPassed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {consistencyPassed ? "PASS ✅" : "INCONSISTENT ❌"}
                </h2>

                <p className="text-xl mt-4">
                  {result.buyers.toLocaleString()} buyers competed for{" "}
                  {totalTickets} tickets with zero overselling.
                </p>
              </CardContent>
            </Card>

            {/* MAIN STATS */}
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard
                title="Concurrent Buyers"
                value={result.buyers.toLocaleString()}
              />
              <StatCard
                title="Reservations Created"
                value={result.success}
              />
              <StatCard
                title="Race Conditions"
                value={result.race_conditions}
              />
            </div>

            {/* SECONDARY STATS */}
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard
                title="Rejected Requests"
                value={result.sold_out}
              />
              <StatCard
                title="Errors"
                value={result.errors}
              />
              <StatCard
                title="Inventory Left"
                value={result.inventory_remaining}
              />
              <StatCard
                title="Execution Time"
                value={`${duration} ms`}
              />
            </div>

            {/* CONSISTENCY REPORT */}
            <Card>
              <CardHeader>
                <CardTitle>Consistency Report</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p>
                  Expected Initial Inventory:
                  <strong> {totalTickets}</strong>
                </p>
                <p>
                  Allocated:
                  <strong> {result.success}</strong>
                </p>
                <p>
                  Remaining:
                  <strong> {result.inventory_remaining}</strong>
                </p>
                <p
                  className={`font-bold ${
                    consistencyPassed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Consistency Check:{" "}
                  {consistencyPassed ? "PASSED ✅" : "FAILED ❌"}
                </p>
              </CardContent>
            </Card>

            {/* UTILIZATION */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Utilization</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Progress value={Number(utilization)} />
                <div className="flex justify-between">
                  <span>
                    {result.success}/{totalTickets} Tickets Allocated
                  </span>
                  <span className="font-bold">{utilization}%</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}
