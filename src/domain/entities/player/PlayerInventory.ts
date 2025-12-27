import type { InventoryItem } from "../../contracts/InvetoryItem";

export class PlayerInventory {
  private readonly items = new Map<string, InventoryItem>();

  add(item: Omit<InventoryItem, "quantity">, amount = 1) {
    const existing = this.items.get(item.id);

    if (existing && item.stackable) {
      existing.quantity += amount;
      return;
    }

    this.items.set(item.id, {
      ...item,
      quantity: amount,
    });
  }

  remove(itemId: string, amount = 1): boolean {
    const item = this.items.get(itemId);
    if (!item) return false;

    item.quantity -= amount;

    if (item.quantity <= 0) {
      this.items.delete(itemId);
    }

    return true;
  }

  has(itemId: string, amount = 1): boolean {
    const item = this.items.get(itemId);
    return !!item && item.quantity >= amount;
  }

  getQuantity(itemId: string): number {
    return this.items.get(itemId)?.quantity ?? 0;
  }

  getAll() {
    return Array.from(this.items.values());
  }

  clear() {
    this.items.clear();
  }
}
