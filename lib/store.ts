export type OrderStatus = "preparing" | "ready";

export interface OrderItemCustomization {
  sweetness: string;
  temperature: string;
  addons: string[];
}

export interface OrderItem {
  key: string;
  name: string;
  price: number;
  qty: number;
  customization: OrderItemCustomization | null;
}

export interface Order {
  id: string;
  token: number;
  table: string;
  phone: string;
  items: OrderItem[];
  instructions: string;
  itemTotal: number;
  gst: number;
  total: number;
  status: OrderStatus;
  placedAt: number;
}

const ORDERS_KEY = "juicy-orders";
const TOKEN_KEY = "juicy-token-counter";
const CHANNEL_NAME = "juicy-orders-channel";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL_NAME);
}

export function nextToken(): number {
  const n = Number(localStorage.getItem(TOKEN_KEY) || "0") + 1;
  localStorage.setItem(TOKEN_KEY, String(n));
  return n;
}

export function placeOrder(order: Omit<Order, "status" | "placedAt">): Order {
  const full: Order = { ...order, status: "preparing", placedAt: Date.now() };
  const orders = [...getOrders(), full];
  saveOrders(orders);
  getChannel()?.postMessage({ type: "order:new", order: full });
  return full;
}

export function markOrderReady(id: string): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status: "ready" };
  saveOrders(orders);
  getChannel()?.postMessage({ type: "order:ready", order: orders[idx] });
  return orders[idx];
}

export type StoreEvent =
  | { type: "order:new"; order: Order }
  | { type: "order:ready"; order: Order }
  | { type: "order:updated" };

export function subscribe(handler: (e: StoreEvent) => void): () => void {
  const channel = getChannel();
  const onMessage = (ev: MessageEvent) => handler(ev.data as StoreEvent);
  channel?.addEventListener("message", onMessage);
  const onStorage = (ev: StorageEvent) => {
    if (ev.key === ORDERS_KEY) handler({ type: "order:updated" });
  };
  window.addEventListener("storage", onStorage);
  return () => {
    channel?.removeEventListener("message", onMessage);
    channel?.close();
    window.removeEventListener("storage", onStorage);
  };
}
