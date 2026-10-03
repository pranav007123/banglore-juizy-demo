"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Minus, ShoppingBag, X, CheckCircle2, UtensilsCrossed, MessageCircle, ChefHat } from "lucide-react";
import { CATEGORIES, MENU, MenuItem } from "@/lib/menu";
import { nextToken, placeOrder, Order } from "@/lib/store";

interface CartLine {
  key: string;
  item: MenuItem;
  qty: number;
  sweetness: string;
  temperature: string;
  addons: string[];
  unitPrice: number;
}

const SWEETNESS_OPTS = ["Normal Sweetness", "Less Sugar", "Sugar-Free"];
const TEMP_OPTS = ["Normal Ice", "Less Ice", "No Ice"];
const ADDON_OPTS = ["Extra Mayo", "Extra Cashews & Dry Fruits"];

export default function MenuClient({ table }: { table: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [upiOpen, setUpiOpen] = useState(false);
  const [upiApp, setUpiApp] = useState("Google Pay");
  const [order, setOrder] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      MENU.filter(
        (m) =>
          (category === "all" || m.category === category) &&
          (m.name.toLowerCase().includes(query.toLowerCase()) || m.description.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, category]
  );

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const itemTotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const gst = Math.round(itemTotal * 0.05);
  const total = itemTotal + gst;

  function addLine(item: MenuItem, sweetness = "", temperature = "", addons: string[] = []) {
    const addonTotal = addons.length * 20;
    const key = `${item.id}|${sweetness}|${temperature}|${addons.join(",")}`;
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.key === key);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { key, item, qty: 1, sweetness, temperature, addons, unitPrice: item.price + addonTotal }];
    });
  }

  function bump(key: string, delta: number) {
    setCart((prev) =>
      prev.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0)
    );
  }

  function handleAdd(item: MenuItem) {
    if (item.customizable) setModalItem(item);
    else addLine(item);
  }

  function phoneValid(p: string) {
    return /^[6-9]\d{9}$/.test(p);
  }

  function simulatePayment() {
    const token = nextToken();
    const placed = placeOrder({
      id: `ord-${Date.now()}`,
      token,
      table,
      phone,
      items: cart.map((l) => ({
        key: l.key,
        name: l.item.name,
        price: l.unitPrice,
        qty: l.qty,
        customization: l.sweetness
          ? { sweetness: l.sweetness, temperature: l.temperature, addons: l.addons }
          : null,
      })),
      instructions,
      itemTotal,
      gst,
      total,
    });
    setOrder(placed);
    setUpiOpen(false);
    setDrawerOpen(false);
    setCart([]);
  }

  if (order) return <OrderStatusView order={order} onNew={() => setOrder(null)} />;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-forest text-white shadow">
        <div className="flex items-center gap-3 px-4 pt-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-mango">
            <UtensilsCrossed className="h-5 w-5 text-forest-dark" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">Bangalore Juicy &amp; Foods</p>
            <p className="text-[11px] text-rose-200">Kanjikuzhi, Kottayam • juicy.co.in</p>
          </div>
          <span className="rounded-full bg-mango px-3 py-1 text-xs font-bold text-forest-dark">Table {table}</span>
        </div>
        <div className="px-4 pb-4 pt-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-slate-700">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search malba, samoona, fries..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                category === c.key ? "bg-mango text-forest-dark" : "bg-white/10 text-rose-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Menu list */}
      <main className="flex flex-col gap-3 p-4">
        {filtered.map((m) => (
          <div key={m.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <span
              className={`mt-1 grid h-4 w-4 shrink-0 place-items-center border-2 ${
                m.veg === "veg" ? "border-green-600 rounded-sm" : "border-red-700"
              }`}
              style={m.veg === "nonveg" ? { borderRadius: 0, clipPath: "polygon(50% 100%, 0 0, 100% 0)" } : undefined}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${m.veg === "veg" ? "bg-green-600" : "bg-red-700"}`} />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{m.name}</h3>
                {m.bestseller && (
                  <span className="rounded bg-mango/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-mango-dark">Bestseller</span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-bold text-slate-800">₹{m.price}</p>
              <p className="mt-1 text-xs text-slate-500">{m.description}</p>
            </div>
            <button
              onClick={() => handleAdd(m)}
              className="self-center rounded-full border border-mango-dark bg-white px-4 py-1.5 text-sm font-bold text-mango-dark shadow-sm active:scale-95"
            >
              ADD
            </button>
          </div>
        ))}
      </main>

      {/* Customization modal */}
      {modalItem && (
        <CustomizeModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onAdd={(sw, t, a) => {
            addLine(modalItem, sw, t, a);
            setModalItem(null);
          }}
        />
      )}

      {/* Floating cart bar */}
      {cartCount > 0 && !drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md p-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-forest px-5 py-4 text-white shadow-xl"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag className="h-4 w-4" /> {cartCount} item{cartCount > 1 ? "s" : ""} • ₹{total}
            </span>
            <span className="text-sm font-bold text-mango">View Cart →</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setDrawerOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 pb-2">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button onClick={() => setDrawerOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4">
              {cart.map((l) => (
                <div key={l.key} className="flex items-center justify-between gap-3 border-b pb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{l.item.name}</p>
                    {l.sweetness && (
                      <p className="text-[11px] text-slate-500">
                        {l.sweetness} • {l.temperature}{l.addons.length ? ` • ${l.addons.join(", ")}` : ""}
                      </p>
                    )}
                    <p className="text-xs text-slate-600">₹{l.unitPrice} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => bump(l.key, -1)} className="rounded-full bg-slate-100 p-1"><Minus className="h-3 w-3" /></button>
                    <span className="w-4 text-center text-sm font-bold">{l.qty}</span>
                    <button onClick={() => bump(l.key, 1)} className="rounded-full bg-slate-100 p-1"><Plus className="h-3 w-3" /></button>
                  </div>
                  <p className="w-14 text-right text-sm font-bold">₹{l.unitPrice * l.qty}</p>
                </div>
              ))}
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Special cooking instructions (e.g. extra spicy, less onion)..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-mango"
                rows={2}
              />
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Customer WhatsApp Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98470XXXXX"
                  className={`mt-1 w-full rounded-xl border p-3 text-sm outline-none ${
                    phone && !phoneValid(phone) ? "border-red-400" : "border-slate-200 focus:border-mango"
                  }`}
                />
                {phone && !phoneValid(phone) && <p className="mt-1 text-[11px] text-red-500">Enter a valid 10-digit mobile number.</p>}
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-sm">
                <div className="flex justify-between"><span>Item Total</span><span>₹{itemTotal}</span></div>
                <div className="flex justify-between text-slate-500"><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className="mt-1 flex justify-between border-t pt-1 font-bold"><span>Final Payable</span><span>₹{total}</span></div>
              </div>
            </div>
            <div className="p-4">
              <button
                disabled={!phoneValid(phone) || cart.length === 0}
                onClick={() => setUpiOpen(true)}
                className="w-full rounded-xl bg-mango py-3 font-bold text-forest-dark disabled:opacity-40"
              >
                Proceed to UPI Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPI modal */}
      {upiOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <h3 className="text-lg font-bold">UPI Payment</h3>
            <p className="text-sm text-slate-500">Amount payable: <span className="font-bold text-slate-900">₹{total}</span></p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                <button
                  key={app}
                  onClick={() => setUpiApp(app)}
                  className={`rounded-xl border-2 p-3 text-sm font-semibold ${upiApp === app ? "border-mango bg-mango/10" : "border-slate-100"}`}
                >
                  {app}
                </button>
              ))}
            </div>
            <button onClick={simulatePayment} className="mt-4 w-full rounded-xl bg-forest py-3 font-bold text-white">
              Simulate Successful Payment
            </button>
            <button onClick={() => setUpiOpen(false)} className="mt-2 w-full py-2 text-sm text-slate-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomizeModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (sw: string, t: string, a: string[]) => void;
}) {
  const [sweetness, setSweetness] = useState(SWEETNESS_OPTS[0]);
  const [temperature, setTemperature] = useState(TEMP_OPTS[0]);
  const [addons, setAddons] = useState<string[]>([]);
  const toggleAddon = (a: string) => setAddons((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 sm:place-items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-4 text-xs font-bold uppercase text-slate-400">Sweetness</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {SWEETNESS_OPTS.map((o) => (
            <button key={o} onClick={() => setSweetness(o)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${sweetness === o ? "bg-forest text-white" : "bg-slate-100"}`}>{o}</button>
          ))}
        </div>
        <p className="mt-4 text-xs font-bold uppercase text-slate-400">Temperature</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {TEMP_OPTS.map((o) => (
            <button key={o} onClick={() => setTemperature(o)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${temperature === o ? "bg-forest text-white" : "bg-slate-100"}`}>{o}</button>
          ))}
        </div>
        <p className="mt-4 text-xs font-bold uppercase text-slate-400">Add-ons (+₹20 each)</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {ADDON_OPTS.map((o) => (
            <button key={o} onClick={() => toggleAddon(o)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${addons.includes(o) ? "bg-mango text-forest-dark" : "bg-slate-100"}`}>{o}</button>
          ))}
        </div>
        <button onClick={() => onAdd(sweetness, temperature, addons)} className="mt-6 w-full rounded-xl bg-mango py-3 font-bold text-forest-dark">
          Add to Cart • ₹{item.price + addons.length * 20}
        </button>
      </div>
    </div>
  );
}

function OrderStatusView({ order, onNew }: { order: Order; onNew: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 bg-forest p-8 text-center text-white">
      <CheckCircle2 className="h-16 w-16 text-mango" />
      <p className="text-sm uppercase tracking-widest text-rose-200">Payment Successful</p>
      <h2 className="text-3xl font-black">Token #{order.token}</h2>
      <p className="rounded-full bg-white/10 px-4 py-1 text-sm font-bold">Table {order.table}</p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <ChefHat className="h-8 w-8 animate-bounce text-mango" />
        <p className="font-semibold">Order Received &amp; Preparing in Kitchen</p>
        <div className="mt-1 h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-mango" />
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-mango/15 p-4 text-left text-sm text-amber-100">
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-mango" />
        <p>You will receive a WhatsApp message when your tray is ready for collection at the counter.</p>
      </div>
      <button onClick={onNew} className="mt-2 text-xs text-rose-300 underline">Place another order</button>
    </div>
  );
}
