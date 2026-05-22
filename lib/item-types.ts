import type { PresetItemType } from "./types";

export const PRESET_ITEM_TYPES: PresetItemType[] = [
  { id: "food", name: "Food", taxRate: 5 },
  { id: "alcohol", name: "Alcohol", taxRate: 15 },
  { id: "drink", name: "Service/Delivery", taxRate: 12 },
];

export function getItemTypeById(typeId: string): PresetItemType | undefined {
  if (typeId === "custom") return undefined;
  return PRESET_ITEM_TYPES.find((type) => type.id === typeId);
}

export function getTaxRateForType(typeId: string): number {
  const type = getItemTypeById(typeId);
  return type?.taxRate ?? 0;
}
