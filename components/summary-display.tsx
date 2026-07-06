"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import type { Summary } from "@/lib/types";
import { calculateGrandTotal } from "@/lib/calculations";

interface SummaryDisplayProps {
  summaries: Summary[];
}

export function SummaryDisplay({ summaries }: SummaryDisplayProps) {
  const grandTotal = calculateGrandTotal(summaries);
  const hasData = summaries.some((s) => s.total > 0);

  return (
    <Card className="p-6 border-2 border-primary">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">Summary</h2>
      </div>

      {!hasData ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          Add expenses to see the split calculation
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {summaries
              .filter((s) => s.total > 0)
              .map((summary) => (
                <div
                  key={summary.participantId}
                  className="p-4 bg-secondary rounded border border-primary"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-foreground">
                      {summary.participantName}
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      ${summary.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items:</span>
                      <span className="font-medium text-foreground">
                        {summary.items.join(", ") || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span className="font-medium text-foreground">
                        ${summary.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {summary.tax > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax:</span>
                        <span className="font-medium text-foreground">
                          ${summary.tax.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {summary.tip > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tip:</span>
                        <span className="font-medium text-foreground">
                          ${summary.tip.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="pt-4 border-t-2 border-primary">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Grand Total</h3>
            </div>

            <div className="p-4 bg-accent/10 rounded border-2 border-primary">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Subtotal:</span>
                  <span className="font-semibold text-foreground">
                    ${grandTotal.subtotal.toFixed(2)}
                  </span>
                </div>
                {grandTotal.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Tax:</span>
                    <span className="font-semibold text-foreground">
                      ${grandTotal.tax.toFixed(2)}
                    </span>
                  </div>
                )}
                {grandTotal.tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Tip:</span>
                    <span className="font-semibold text-foreground">
                      ${grandTotal.tip.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-accent">
                  <span className="font-bold text-foreground">
                    Grand Total:
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    ${grandTotal.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
