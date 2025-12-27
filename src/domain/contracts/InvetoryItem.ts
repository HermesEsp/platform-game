import type { ItemType } from "../valueObjects/ItemType";

export interface InventoryItem {
  id: string;
  type: ItemType;
  name: string;
  stackable: boolean;
  quantity: number;
  onChange?: () => void;
}
