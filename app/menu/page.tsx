import MenuClient from "./MenuClient";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const { table } = await searchParams;
  const normalized = (table ?? "4").padStart(2, "0");
  return <MenuClient table={normalized} />;
}
