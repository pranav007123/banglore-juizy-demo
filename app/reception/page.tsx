"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, ChefHat, CheckCheck, MessageCircle, Volume2 } from "lucide-react";
import { getOrders, markOrderReady, Order, subscribe } from "@/lib/store";
import { playChime, playDoubleChime, unlockAudio } from "@/lib/audio";

function elapsed(placedAt: number, now: number) {
  const mins = Math.max(0, Math.floor((now - placedAt) / 60000));
  if (mins < 1) return "just now";
  return `${mins} min ago`;
}

export default function ReceptionPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    const unsub = subscribe((e) => {
      if (e.type === "order:new") {
        playChime();
        setOrders((prev) => [...prev, e.order]);
      } else if (e.type === "order:ready") {
        setOrders((prev) => prev.map((o) => (o.id === e.order.id ? e.order : o)));
      } else {
        setOrders(getOrders());
      }
    });
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => {
      unsub();
      clearInterval(t);
    };
  }, []);

  const preparing = useMemo(() => orders.filter((o) => o.status === "preparing"), [orders]);
  const ready = useMemo(() => orders.filter((o) => o.status === "ready"), [orders]);

  async function enableSound() {
    await unlockAudio();
    setSoundOn(true);
  }

  function handleReady(id: string) {
    markOrderReady(id);
    playDoubleChime();
    setOrders(getOrders());
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-forest">Kitchen &amp; Reception KDS</h1>
          <p className="text-xs text-slate-500">Bangalore Juicy &amp; Foods • Kanjikuzhi Counter</p>
        </div>
        <button
          onClick={enableSound}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
            soundOn ? "bg-forest text-white" : "bg-mango text-forest-dark"
          }`}
        >
          <Volume2 className="h-4 w-4" /> {soundOn ? "Sound On" : "Enable Sound"}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Column title="Preparing in Kitchen" icon={<ChefHat className="h-4 w-4" />} count={preparing.length} accent="text-mango-dark">
          {preparing.map((o) => (
            <Ticket key={o.id} order={o} now={now} onReady={() => handleReady(o.id)} />
          ))}
          {preparing.length === 0 && <Empty text="No active orders — waiting for the next token…" />}
        </Column>
        <Column title="Ready for Collection" icon={<CheckCheck className="h-4 w-4" />} count={ready.length} accent="text-forest">
          {ready.map((o) => (
            <Ticket key={o.id} order={o} now={now} done />
          ))}
          {ready.length === 0 && <Empty text="No ready orders yet." />}
        </Column>
      </div>
    </div>
  );
}

function Column({
  title,
  icon,
  count,
  accent,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <h2 className={`mb-3 flex items-center gap-2 font-bold ${accent}`}>
        {icon} {title} <span className="rounded-full bg-slate-100 px-2 text-xs">{count}</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Ticket({ order, now, onReady, done }: { order: Order; now: number; onReady?: () => void; done?: boolean }) {
  return (
    <div className={`rounded-xl border-l-4 p-4 shadow-sm ${done ? "border-forest bg-rose-50" : "border-mango bg-amber-50"}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-black text-slate-900">Token #{order.token}</span>
        <span className="rounded-full bg-forest px-3 py-0.5 text-xs font-bold text-white">Table {order.table}</span>
      </div>
      <p className="mt-1 text-[11px] font-semibold uppercase text-slate-500">Placed {elapsed(order.placedAt, now)}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {order.items.map((it) => (
          <li key={it.key}>
            <span className="font-bold">{it.qty}x {it.name}</span>
            {it.customization && (
              <span className="text-slate-500"> ({[it.customization.sweetness, it.customization.temperature.replace(" Sweetness", ""), ...it.customization.addons].join(", ")})</span>
            )}
          </li>
        ))}
      </ul>
      {order.instructions && <p className="mt-2 rounded bg-white/70 p-2 text-xs italic text-slate-600">📝 {order.instructions}</p>}
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-600">
        <MessageCircle className="h-3 w-3" /> +91 {order.phone}
      </p>
      {!done && (
        <button onClick={onReady} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-2.5 text-sm font-bold text-white active:scale-[0.98]">
          <Bell className="h-4 w-4" /> Mark Ready &amp; Send WhatsApp
        </button>
      )}
      {done && <p className="mt-2 text-center text-xs font-bold text-forest">✅ Customer notified via WhatsApp</p>}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-slate-400">{text}</p>;
}
