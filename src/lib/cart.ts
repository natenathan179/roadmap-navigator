import { useCallback, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  stock_number: string;
  price: number;
  photo: string | null;
};

const KEY = "srrv-cart";
const EVENT = "srrv-cart-change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: CartItem) => {
    const current = read();
    if (current.some((i) => i.id === item.id)) return false;
    write([...current, item]);
    return true;
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => write([]), []);

  const total = items.reduce((sum, i) => sum + (i.price || 0), 0);

  return { items, add, remove, clear, total, count: items.length };
}
