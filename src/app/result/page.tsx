import { redirect } from "next/navigation";

type ResultPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ResultRedirectPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const type = params.type ?? "";
  redirect(`/result/${type}`);
}
