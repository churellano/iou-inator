"use client";

import { useState, useMemo } from "react";
import { ParticipantManager } from "@/components/participant-manager";
import { ExpenseManager } from "@/components/expense-manager";
import { SummaryDisplay } from "@/components/summary-display";
import { calculateSummary } from "@/lib/calculations";
import type { Participant, ExpenseItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function ExpenseSplitterPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [tipRate, setTipRate] = useState("");
  const [isTipBeforeTax, setIsTipBeforeTax] = useState(false);

  const summaries = useMemo(
    () =>
      calculateSummary(
        expenses,
        participants,
        Number.parseFloat(tipRate),
        isTipBeforeTax,
      ),
    [expenses, participants, tipRate, isTipBeforeTax],
  );

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2 text-balance">
            Expense Splitter
          </h1>
          <p className="text-muted-foreground text-pretty">
            Split bills among friends with customizable fees
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <ParticipantManager
            participants={participants}
            onParticipantsChange={setParticipants}
          />
          <ExpenseManager
            expenses={expenses}
            participants={participants}
            onExpensesChange={setExpenses}
          />
        </div>

        <Card className="p-6 border-2 border-primary mb-6">
          <label className="text-xl font-bold text-primary">Tip Rate (%)</label>
          <Input
            type="number"
            placeholder="Enter your tip percentage"
            value={tipRate}
            onChange={(e) => setTipRate(e.target.value)}
            className="flex-1 bg-background border-primary"
            step="1"
            min="0"
          />
          <div className="flex gap-2 items-center">
            <Checkbox
              checked={isTipBeforeTax}
              onCheckedChange={(checked) => setIsTipBeforeTax(!!checked)}
            />
            <label className="text-sm font-medium">Tip before tax?</label>
          </div>
        </Card>

        <SummaryDisplay summaries={summaries} />
      </div>
    </main>
  );
}
