import { redirect } from "next/navigation";

type LegacyCarbResultPageProps = {
  params: Promise<{ type: string }>;
};

export default async function LegacyCarbResultPage({ params }: LegacyCarbResultPageProps) {
  const { type } = await params;
  redirect(`/result/nutri/${encodeURIComponent(type)}`);
}
