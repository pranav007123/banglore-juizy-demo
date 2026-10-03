import { NextRequest, NextResponse } from "next/server";

// Simulated Meta Cloud API "order ready" utility template message.
// This mirrors the exact payload shape sent by WhatsApp Business Cloud API.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { phone = "9847012345", token = 18, table = "04" } = body;

  const payload = {
    messaging_product: "whatsapp",
    to: `91${String(phone).replace(/\D/g, "").slice(-10)}`,
    type: "template",
    template: {
      name: "order_ready_for_pickup",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: `#${token}` },
            { type: "text", text: `Table ${table}` },
            { type: "text", text: "Bangalore Juicy & Foods, Kanjikuzhi, Kottayam" },
          ],
        },
      ],
    },
    // Rendered preview of the customer-visible utility message:
    _preview: `Hi! 👋 Your order Token #${token} (Table ${table}) at Bangalore Juicy & Foods, Kanjikuzhi is READY for collection at the counter. Thank you! — juicy.co.in`,
  };

  return NextResponse.json({ ok: true, simulated: true, payload });
}
