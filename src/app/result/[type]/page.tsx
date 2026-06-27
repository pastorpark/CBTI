import { redirect } from "next/navigation";
import { resolvePersonaResultKey } from "@/lib/result-aliases";

type LegacyResultPageProps = {
  params: Promise<{ type: string }>;
};

export default async function LegacyResultPage({ params }: LegacyResultPageProps) {
  const { type } = await params;
  const resolvedType = resolvePersonaResultKey(type);
  redirect(`/result/cbti/${encodeURIComponent(resolvedType || type)}`);
}
