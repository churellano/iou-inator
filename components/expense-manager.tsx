"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Plus, Receipt, ChevronDown, ChevronUp } from "lucide-react";
import type { ExpenseItem, Participant } from "@/lib/types";
import { PRESET_ITEM_TYPES, getTaxRateForType } from "@/lib/item-types";
import { getIsValidExpense } from "@/lib/getIsValidExpense";
import { createEvenParticipantSplits } from "@/lib/calculations";

interface ExpenseManagerProps {
  expenses: ExpenseItem[];
  participants: Participant[];
  onExpensesChange: (expenses: ExpenseItem[]) => void;
}

export function ExpenseManager({
  expenses,
  participants,
  onExpensesChange,
}: ExpenseManagerProps) {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemType, setItemType] = useState<string>("custom");
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);

  const addExpense = () => {
    if (getIsValidExpense({ itemName, itemQuantity, itemPrice })) {
      const taxRate = itemType === "custom" ? 0 : getTaxRateForType(itemType);
      const participantSplits: Record<string, number> = {};
      const equalSplit = 100 / participants.length;
      participants.forEach((p) => {
        participantSplits[p.id] = equalSplit;
      });

      const newExpense: ExpenseItem = {
        id: crypto.randomUUID(),
        name: itemName.trim(),
        quantity: Number.parseInt(itemQuantity, 10),
        price: Number.parseFloat(itemPrice),
        participants: participants.map((p) => p.id), // Default: all participants
        participantSplits,
        itemType,
        taxRate,
        tipRate: 0,
      };
      onExpensesChange([...expenses, newExpense]);
      setItemName("");
      setItemQuantity("");
      setItemPrice("");
      setItemType("custom");
    }
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    onExpensesChange(
      expenses.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const toggleParticipant = (expenseId: string, participantId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;

    const isIncluded = expense.participants.includes(participantId);
    let newParticipants: string[];
    const newSplits = { ...expense.participantSplits };

    if (isIncluded) {
      // Remove participant
      newParticipants = expense.participants.filter(
        (id) => id !== participantId
      );
      delete newSplits[participantId];
    } else {
      // Add participant with default split
      newParticipants = [...expense.participants, participantId];
      newSplits[participantId] = 0;
    }

    if (newParticipants.length > 0) {
      updateExpense(expenseId, {
        participants: newParticipants,
        participantSplits: newSplits,
      });
    }
  };

  const toggleAllParticipants = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;

    const allSelected = expense.participants.length === participants.length;
    const newParticipants = allSelected
      ? [participants[0].id]
      : participants.map((p) => p.id);

    const newSplits: Record<string, number> = {};
    if (newParticipants.length > 0) {
      const equalSplit = 100 / newParticipants.length;
      newParticipants.forEach((id) => {
        newSplits[id] = equalSplit;
      });
    }

    updateExpense(expenseId, {
      participants: newParticipants,
      participantSplits: newSplits,
    });
  };

  const handleItemTypeChange = (expenseId: string, newTypeId: string) => {
    if (newTypeId === "custom") {
      updateExpense(expenseId, { itemType: "custom" });
    } else {
      const taxRate = getTaxRateForType(newTypeId);
      updateExpense(expenseId, { itemType: newTypeId, taxRate });
    }
  };

  const getTotalPercentage = (
    splits: Record<string, number>,
    participantIds: string[]
  ) => {
    return participantIds.reduce((sum, id) => sum + (splits[id] || 0), 0);
  };

  const splitEvenly = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;

    const equalSplit = 100 / expense.participants.length;
    const newSplits: Record<string, number> = {};
    expense.participants.forEach((id) => {
      newSplits[id] = equalSplit;
    });
    updateExpense(expenseId, {
      participantSplits: createEvenParticipantSplits(expense.participants),
    });
  };

  return (
    <Card className="p-6 border-2 border-primary">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">Expenses</h2>
      </div>

      {participants.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          Add participants first before adding expenses
        </p>
      ) : (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1 bg-background border-primary"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              className="w-24 bg-background border-primary"
              step="1"
              min="1"
            />
            <Input
              type="number"
              placeholder="Price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-24 bg-background border-primary"
              step="0.01"
              min="0"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-primary rounded text-sm text-foreground"
            >
              <option value="custom">Custom Tax Rate</option>
              {PRESET_ITEM_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.taxRate}%)
                </option>
              ))}
            </select>
            <Button
              onClick={addExpense}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No expenses yet. Add an item to get started!
              </p>
            ) : (
              expenses.map((expense) => {
                const totalPercentage = getTotalPercentage(
                  expense.participantSplits,
                  expense.participants
                );
                const isInvalid = Math.abs(totalPercentage - 100) > 0.01;

                return (
                  <div
                    key={expense.id}
                    className="p-4 bg-secondary rounded border border-primary"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {expense.name}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          $
                          {`${(expense.quantity * expense.price).toFixed(
                            2
                          )} ($${expense.price.toFixed(2)} ea)`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpense(expense.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Item Type
                        </label>
                        <select
                          value={expense.itemType}
                          onChange={(e) =>
                            handleItemTypeChange(expense.id, e.target.value)
                          }
                          className="w-full px-3 py-2 bg-background border border-primary rounded text-sm text-foreground"
                        >
                          <option value="custom">Custom</option>
                          {PRESET_ITEM_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name} ({type.taxRate}%)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          {expense.itemType === "custom"
                            ? "Tax Rate (%)"
                            : "Tax Rate (%)"}
                        </label>
                        <Input
                          type="number"
                          value={expense.taxRate}
                          onChange={(e) =>
                            updateExpense(expense.id, {
                              taxRate: e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined,
                              itemType: "custom",
                            })
                          }
                          className="bg-background border-primary"
                          step="0.1"
                          min="0"
                          max="100"
                          disabled={expense.itemType !== "custom"}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Tip Rate (%)
                        </label>
                        <Input
                          type="number"
                          value={expense.tipRate}
                          onChange={(e) =>
                            updateExpense(expense.id, {
                              tipRate: e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          className="bg-background border-primary"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <button
                        onClick={() =>
                          setExpandedExpense(
                            expandedExpense === expense.id ? null : expense.id
                          )
                        }
                        className="flex items-center justify-between w-full text-left hover:opacity-70 transition-opacity"
                      >
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Split breakdown:
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isInvalid ? "text-destructive" : "text-foreground"
                            }`}
                          >
                            {isInvalid
                              ? `${totalPercentage.toFixed(
                                  1
                                )}% (must equal 100%)`
                              : "100% allocated"}
                          </p>
                        </div>
                        {expandedExpense === expense.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>

                      {expandedExpense === expense.id && (
                        <div className="mt-3 space-y-3 p-3 bg-background rounded border border-primary">
                          {expense.participants.map((participantId) => {
                            const participant = participants.find(
                              (p) => p.id === participantId
                            );
                            if (!participant) return null;

                            return (
                              <div
                                key={participantId}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm font-medium text-foreground flex-1">
                                  {participant.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    value={
                                      expense.participantSplits[
                                        participantId
                                      ] || 0
                                    }
                                    onChange={(e) => {
                                      const newValue =
                                        Number.parseFloat(e.target.value) || 0;
                                      updateExpense(expense.id, {
                                        participantSplits: {
                                          ...expense.participantSplits,
                                          [participantId]: Math.max(
                                            0,
                                            Math.min(100, newValue)
                                          ),
                                        },
                                      });
                                    }}
                                    className="w-20 bg-background border-primary text-right"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                  />
                                  <span className="text-sm text-muted-foreground w-6">
                                    %
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleParticipant(expense.id, participantId)
                                  }
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            );
                          })}

                          <div className="flex justify-end">
                            <Button
                              color="indigo"
                              variant="secondary"
                              size="default"
                              onClick={() => splitEvenly(expense.id)}
                              disabled={expense.participants.length <= 1}
                              className="h-8 w-24 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              Split evenly
                            </Button>
                          </div>

                          <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">
                              Add participant:
                            </p>
                            <div className="space-y-1">
                              {participants
                                .filter(
                                  (p) => !expense.participants.includes(p.id)
                                )
                                .map((participant) => (
                                  <button
                                    key={participant.id}
                                    onClick={() =>
                                      toggleParticipant(
                                        expense.id,
                                        participant.id
                                      )
                                    }
                                    className="w-full text-left px-2 py-1 text-sm text-foreground hover:bg-primary/10 rounded transition-colors"
                                  >
                                    + {participant.name}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </Card>
  );
}
