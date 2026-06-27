import { redirect } from "next/navigation";
import { resolveNutritionResultKey } from "@/lib/result-aliases";

type LegacyNutritionResultPageProps = {
  params: Promise<{ type: string }>;
};

export default async function LegacyNutritionResultPage({ params }: LegacyNutritionResultPageProps) {
  const { type } = await params;
  const resolvedType = resolveNutritionResultKey(type);
  redirect(`/result/nutri/${encodeURIComponent(resolvedType || type)}`);
}
