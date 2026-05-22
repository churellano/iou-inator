"use client";

import { useState, useMemo } from "react";
import { ParticipantManager } from "@/components/participant-manager";
import { ExpenseManager } from "@/components/expense-manager";
import { SummaryDisplay } from "@/components/summary-display";
import { calculateSummary } from "@/lib/calculations";
import type { Participant, ExpenseItem } from "@/lib/types";

export default function ExpenseSplitterPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const summaries = useMemo(
    () => calculateSummary(expenses, participants),
    [expenses, participants]
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

        <SummaryDisplay summaries={summaries} />
      </div>
    </main>
  );
}
