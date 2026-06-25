import { redirect } from "next/navigation";

type LegacyResultPageProps = {
  params: Promise<{ type: string }>;
};

export default async function LegacyResultPage({ params }: LegacyResultPageProps) {
  const { type } = await params;
  redirect(`/result/cbti/${encodeURIComponent(type)}`);
}
