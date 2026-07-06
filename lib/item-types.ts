import type { PresetItemType } from "./types";

export enum ItemType {
  Custom = "custom",
  Food = "food",
  Drink = "drink",
  Alcohol = "alcohol",
}

export const PRESET_ITEM_TYPES: PresetItemType[] = [
  { id: ItemType.Food, name: "Food", taxRate: 5 },
  { id: ItemType.Drink, name: "Drink", taxRate: 12 },
  { id: ItemType.Alcohol, name: "Alcohol", taxRate: 15 },
];

export function getItemTypeById(typeId: string): PresetItemType | undefined {
  if (typeId === "custom") return undefined;
  return PRESET_ITEM_TYPES.find((type) => type.id === typeId);
}

export function getTaxRateForType(typeId: ItemType): number {
  const type = getItemTypeById(typeId);
  return type?.taxRate ?? 0;
}
