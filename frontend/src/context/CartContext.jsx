// HESHAURA — lightweight frontend-only cart store (Account 2).
// Context + reducer. No backend; state persists to localStorage so a refresh
// keeps the bag. Cart is variant-aware: the same product with different
// variant selections becomes separate line items.

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "heshaura_cart_v1";

// Build a stable line-item key from slug + selected variant option ids.
const lineKey = (slug, selections = {}) => {
  const parts = Object.keys(selections)
    .sort()
    .map((type) => `${type}:${selections[type].id}`);
  return [slug, ...parts].join("|");
};

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { item } = action;
      const existing = state.find((l) => l.key === item.key);
      if (existing) {
        return state.map((l) =>
          l.key === item.key
            ? { ...l, qty: Math.min(l.qty + item.qty, l.maxStock || 99) }
            : l,
        );
      }
      return [...state, item];
    }
    case "SET_QTY": {
      return state
        .map((l) =>
          l.key === action.key
            ? { ...l, qty: Math.max(1, Math.min(action.qty, l.maxStock || 99)) }
            : l,
        )
        .filter((l) => l.qty > 0);
    }
    case "REMOVE":
      return state.filter((l) => l.key !== action.key);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [items]);

  const value = useMemo(() => {
    const itemCount = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((s, l) => s + l.unitPrice * l.qty, 0);

    // Add a resolved product (+ optional variant selections) to the bag.
    const addItem = (product, selections = {}, qty = 1) => {
      const priceDelta = Object.values(selections).reduce(
        (d, opt) => d + (opt.priceDelta || 0),
        0,
      );
      // maxStock: tightest of product stock and any selected option stock.
      const optionStocks = Object.values(selections)
        .map((o) => o.stock)
        .filter((s) => typeof s === "number");
      const maxStock = Math.min(product.stock, ...(optionStocks.length ? optionStocks : [product.stock]));
      const variantLabels = Object.entries(selections).map(([type, opt]) => ({
        type,
        label: opt.variantLabel || type,
        optionLabel: opt.label,
      }));
      const item = {
        key: lineKey(product.slug, selections),
        slug: product.slug,
        name: product.name,
        image: product.image,
        basePrice: product.price,
        unitPrice: product.price + priceDelta,
        qty,
        maxStock,
        variantLabels,
      };
      dispatch({ type: "ADD", item });
    };

    return {
      items,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      setQty: (key, qty) => dispatch({ type: "SET_QTY", key, qty }),
      removeItem: (key) => dispatch({ type: "REMOVE", key }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
