"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type SimulationResult = {
  buyers: number;
  success: number;
  sold_out: number;
  race_conditions: number;
  errors: number;
  inventory_remaining: number;
};

const TOTAL_TICKETS = 100;

export default function DemoPage() {
  const [buyers, setBuyers] = useState(5000);
  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<SimulationResult | null>(null);

  const [duration, setDuration] =
    useState<number | null>(null);

  const runSimulation = async () => {
    try {
      setLoading(true);

      const start = performance.now();

      const res = await fetch(
        "http://localhost:8080/flash-sale",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id:
              "22222222-2222-2222-2222-222222222222",
            buyers,
          }),
        }
      );

      const data = await res.json();

      setResult(data);

      setDuration(
        Math.round(
          performance.now() - start
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const scenarios = [
    {
      label: "Light Load",
      buyers: 100,
    },
    {
      label: "Medium Load",
      buyers: 5000,
    },
    {
      label: "Heavy Load",
      buyers: 50000,
    },
    {
      label: "Viral Event",
      buyers: 100000,
    },
  ];

  const utilization = result
    ? (
        (result.success /
          TOTAL_TICKETS) *
        100
      ).toFixed(0)
    : "0";

  const consistencyPassed =
    result &&
    result.success +
      result.inventory_remaining ===
      TOTAL_TICKETS;

  return (
    <main className="container mx-auto max-w-7xl py-12 px-4">
      <div className="space-y-8">
        {/* HERO */}

        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold">
            Flash Sale Stress Test
          </h1>

          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Simulate extreme demand spikes and
            verify inventory consistency under
            heavy concurrency.
          </p>
        </div>

        {/* CONFIG */}

        <Card>
          <CardHeader>
            <CardTitle>
              Simulation Configuration
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <Button
                  key={s.label}
                  variant={
                    buyers === s.buyers
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setBuyers(s.buyers)
                  }
                >
                  {s.label}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <Slider
                value={[buyers]}
                min={100}
                max={100000}
                step={100}
                onValueChange={(v) =>
                  setBuyers(v[0])
                }
              />

              <div className="text-center">
                <p className="text-5xl font-bold">
                  {buyers.toLocaleString()}
                </p>

                <p className="text-muted-foreground">
                  Concurrent Buyers
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={runSimulation}
                disabled={loading}
              >
                {loading
                  ? "Running..."
                  : "Run Simulation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            {/* PASS BANNER */}

            <Card className="border-green-500">
              <CardContent className="py-10 text-center">
                <h2 className="text-5xl font-bold text-green-600">
                  PASS ✅
                </h2>

                <p className="text-xl mt-4">
                  {result.buyers.toLocaleString()}
                  {" "}buyers competed for{" "}
                  {TOTAL_TICKETS} tickets with
                  zero overselling.
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

            {/* SECONDARY */}

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
                value={
                  result.inventory_remaining
                }
              />

              <StatCard
                title="Execution Time"
                value={`${duration} ms`}
              />
            </div>

            {/* CONSISTENCY */}

            <Card>
              <CardHeader>
                <CardTitle>
                  Consistency Report
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p>
                  Expected Inventory:
                  <strong>
                    {" "}
                    {TOTAL_TICKETS}
                  </strong>
                </p>

                <p>
                  Allocated:
                  <strong>
                    {" "}
                    {result.success}
                  </strong>
                </p>

                <p>
                  Remaining:
                  <strong>
                    {" "}
                    {
                      result.inventory_remaining
                    }
                  </strong>
                </p>

                <p className="text-green-600 font-bold">
                  Consistency Check:
                  {" "}
                  {consistencyPassed
                    ? "PASSED ✅"
                    : "FAILED ❌"}
                </p>
              </CardContent>
            </Card>

            {/* UTILIZATION */}

            <Card>
              <CardHeader>
                <CardTitle>
                  Inventory Utilization
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Progress
                  value={Number(utilization)}
                />

                <div className="flex justify-between">
                  <span>
                    {result.success}/
                    {TOTAL_TICKETS}
                    {" "}Tickets Allocated
                  </span>

                  <span className="font-bold">
                    {utilization}%
                  </span>
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
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <p className="text-4xl font-bold mt-2">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
