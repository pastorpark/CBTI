import { redirect } from "next/navigation";

type LegacyNutritionResultPageProps = {
  params: Promise<{ type: string }>;
};

export default async function LegacyNutritionResultPage({ params }: LegacyNutritionResultPageProps) {
  const { type } = await params;
  redirect(`/result/nutri/${encodeURIComponent(type)}`);
}
