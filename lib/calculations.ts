import type { ExpenseItem, Participant, Summary } from "./types";

export function calculateSummary(
  expenses: ExpenseItem[],
  participants: Participant[]
): Summary[] {
  // Initialize summary for each participant
  const summaries: Summary[] = participants.map((participant) => ({
    participantId: participant.id,
    participantName: participant.name,
    subtotal: 0,
    tax: 0,
    tip: 0,
    total: 0,
  }));

  // Calculate each expense
  expenses.forEach((expense) => {
    const itemTotal = expense.quantity * expense.price;

    expense.participants.forEach((participantId) => {
      const percentage = expense.participantSplits[participantId] || 0;
      if (percentage <= 0) return;

      // Calculate this participant's share based on their percentage
      const shareRatio = percentage / 100;
      const participantSubtotal = itemTotal * shareRatio;
      const participantTax = ((itemTotal * expense.taxRate) / 100) * shareRatio;
      const participantTip = ((itemTotal * expense.tipRate) / 100) * shareRatio;

      const summary = summaries.find((s) => s.participantId === participantId);
      if (summary) {
        summary.subtotal += participantSubtotal;
        summary.tax += participantTax;
        summary.tip += participantTip;
        summary.total += participantSubtotal + participantTax + participantTip;
      }
    });
  });

  return summaries;
}

export function calculateGrandTotal(summaries: Summary[]): {
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
} {
  return summaries.reduce(
    (acc, summary) => ({
      subtotal: acc.subtotal + summary.subtotal,
      tax: acc.tax + summary.tax,
      tip: acc.tip + summary.tip,
      total: acc.total + summary.total,
    }),
    { subtotal: 0, tax: 0, tip: 0, total: 0 }
  );
}

export const createEvenParticipantSplits = (participantIds: string[]) => {
  const numberOfParticipants = participantIds.length;
  const totalPoints = 10000; // 100.00 with 2 decimal places
  const basePoints = Math.floor(totalPoints / numberOfParticipants);
  const leftoverPoints = totalPoints - basePoints * numberOfParticipants;

  // Everyone starts with the base (in cents)
  const cents = Array(numberOfParticipants).fill(basePoints);

  // Randomly select leftover distinct people
  const chosen = new Set<number>();
  while (chosen.size < leftoverPoints) {
    chosen.add(Math.floor(Math.random() * numberOfParticipants));
  }

  // Give each selected person +1 cent
  for (const i of chosen) {
    cents[i] += 1;
  }

  // Convert back to 2-decimal numbers
  const pointsInPercentages = cents.map((c) => c / 100);
  const participantSplits: Record<string, number> = {};
  for (let i = 0; i < numberOfParticipants; i++) {
    participantSplits[participantIds[i]] = pointsInPercentages[i];
  }

  return participantSplits;
};
