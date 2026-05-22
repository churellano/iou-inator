export interface Participant {
  id: string;
  name: string;
}

export interface PresetItemType {
  id: string;
  name: string;
  taxRate: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  participants: string[]; // participant IDs
  participantSplits: Record<string, number>; // participantId -> percentage (0-100)
  itemType: "custom" | string; // "custom" or preset type id
  taxRate: number; // percentage
  tipRate: number; // percentage
}

export interface Summary {
  participantId: string;
  participantName: string;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}
