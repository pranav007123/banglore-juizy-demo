"use client";

import { useState } from "react";
import { Smartphone, MonitorCog, MessageSquareText, Play } from "lucide-react";

export default function HomePage() {
  const [demo, setDemo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-forest px-6 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-mango">juicy.co.in</p>
        <h1 className="mt-1 text-3xl font-black">Bangalore Juicy &amp; Foods — Management Pitch Prototype</h1>
        <p className="mt-1 text-sm text-rose-200">Freshness You Can Taste • Table Ordering &amp; Instant Pickup</p>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <LaunchCard
            icon={<Smartphone className="h-6 w-6 text-mango-dark" />}
            title="Customer Mobile View (Table 04)"
            desc="Scan-to-order menu, cart, UPI payment & token."
            href="/menu?table=4"
          />
          <LaunchCard
            icon={<MonitorCog className="h-6 w-6 text-mango-dark" />}
            title="Kitchen & Reception KDS"
            desc="Live order tickets, timers & WhatsApp triggers."
            href="/reception"
          />
        </div>

        <button
          onClick={() => setDemo((d) => !d)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-mango py-4 font-bold text-forest-dark shadow active:scale-[0.99]"
        >
          <Play className="h-5 w-5" /> {demo ? "Hide" : "Start"} Side-by-Side Live Demo Mode
        </button>

        {demo && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <DemoFrame title="Customer Mobile — Table 04">
              <iframe src="/menu?table=4" className="h-[600px] w-full rounded-xl border-0" title="Customer" />
            </DemoFrame>
            <DemoFrame title="Kitchen / Reception KDS">
              <iframe src="/reception" className="h-[600px] w-full rounded-xl border-0" title="Reception" />
            </DemoFrame>
            <DemoFrame title="Customer Phone — WhatsApp Alerts">
              <iframe src="/lockscreen" className="h-[600px] w-full rounded-xl border-0" title="Lockscreen" />
            </DemoFrame>
          </div>
        )}

        <p className="mt-8 flex items-center gap-2 text-center text-xs text-slate-400">
          <MessageSquareText className="h-3 w-3" />
          Orders sync live across tabs via BroadcastChannel — no server needed for this prototype.
        </p>
      </main>
    </div>
  );
}

function LaunchCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <a href={href} target="_blank" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50">{icon}</div>
      <h2 className="mt-3 font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
      <p className="mt-3 text-xs font-bold text-mango-dark">Open →</p>
    </a>
  );
}

function DemoFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <p className="mb-2 text-center text-xs font-bold text-forest">{title}</p>
      {children}
    </div>
  );
}
