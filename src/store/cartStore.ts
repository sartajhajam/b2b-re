import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Product ID + characteristics to be unique if needed, or simple ID
    productId: string;
    name: string;
    image: string;
    price?: number; // Optional if price is hidden or not applicable
    quantity: number;
    color?: string;
    size?: string;
    productType?: string;
    moq: number; // Required for validation
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const items = get().items;
                // Check if item already exists (same product, color, size)
                const existingItemIndex = items.findIndex(
                    (item) =>
                        item.productId === newItem.productId &&
                        item.color === newItem.color &&
                        item.size === newItem.size
                );

                if (existingItemIndex > -1) {
                    // Update quantity
                    const newItems = [...items];
                    const itemIndex = existingItemIndex;
                    newItems[itemIndex] = {
                        ...newItems[itemIndex],
                        quantity: newItems[itemIndex].quantity + newItem.quantity
                    };
                    set({ items: newItems });
                } else {
                    set({ items: [...items, newItem] });
                }
            },
            removeItem: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
            },
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
        }),
        {
            name: 'b2b-cart-storage',
        }
    )
);
