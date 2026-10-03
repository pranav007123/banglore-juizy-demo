"use client";

import { useEffect, useState } from "react";
import { Wifi, BatteryFull, Signal, Volume2 } from "lucide-react";
import { Order, subscribe } from "@/lib/store";
import { playPing, unlockAudio } from "@/lib/audio";

interface Alert {
  id: string;
  order: Order;
  at: number;
}

export default function LockscreenPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundOn, setSoundOn] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const unsub = subscribe((e) => {
      if (e.type === "order:ready") {
        playPing();
        setAlerts((prev) => [{ id: `${e.order.id}-${Date.now()}`, order: e.order, at: Date.now() }, ...prev].slice(0, 4));
      }
    });
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => {
      unsub();
      clearInterval(t);
    };
  }, []);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-800 p-4">
      <div className="flex h-[640px] w-[320px] flex-col rounded-[2.5rem] border-4 border-slate-900 bg-gradient-to-b from-rose-950 via-red-950 to-slate-950 p-4 text-white shadow-2xl">
        {/* status bar */}
        <div className="flex items-center justify-between text-[10px] text-rose-100">
          <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" /> <Wifi className="h-3 w-3" /> <BatteryFull className="h-3 w-3" />
          </div>
        </div>

        <p className="mt-8 text-center text-5xl font-thin">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-center text-xs text-rose-200">
          {time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </p>

        <button
          onClick={async () => {
            await unlockAudio();
            setSoundOn(true);
          }}
          className={`mx-auto mt-4 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold ${soundOn ? "bg-rose-700" : "bg-amber-500 text-black"}`}
        >
          <Volume2 className="h-3 w-3" /> {soundOn ? "Sound On" : "Tap to enable sound"}
        </button>

        <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
          {alerts.map((a) => (
            <div key={a.id} className="animate-[slideDown_0.4s_ease] rounded-2xl bg-white/95 p-3 text-slate-900 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#25D366] text-xs font-black text-white">W</div>
                <p className="text-xs font-bold">WhatsApp</p>
                <p className="ml-auto text-[10px] text-slate-400">now</p>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-slate-800">
                Bangalore Juicy &amp; Foods
              </p>
              <p className="text-xs text-slate-600">
                Hi! 👋 Your order Token #{a.order.token} (Table {a.order.table}) is READY for collection at the counter. 🎉
              </p>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="mt-10 text-center text-[11px] text-rose-200/70">
              Waiting for WhatsApp order updates…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
