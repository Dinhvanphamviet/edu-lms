"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  cover_image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => boolean;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.id === item.id)) {
          return false;
        }
        set({ items: [...items, item] });
        return true;
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      isInCart: (id) => {
        return get().items.some((i) => i.id === id);
      },

      getItemCount: () => {
        return get().items.length;
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
