import { redirect } from "next/navigation";
import { resolveNutritionResultKey } from "@/lib/result-aliases";

type LegacyCarbResultPageProps = {
  params: Promise<{ type: string }>;
};

export default async function LegacyCarbResultPage({ params }: LegacyCarbResultPageProps) {
  const { type } = await params;
  const resolvedType = resolveNutritionResultKey(type);
  redirect(`/result/nutri/${encodeURIComponent(resolvedType || type)}`);
}
