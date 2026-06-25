import { headers } from "next/headers";
import { HomeClient } from "@/app/HomeClient";
import { resolveSiteVariantId } from "@/variants";

export default async function Home() {
  const variantId = resolveSiteVariantId((await headers()).get("host"));

  return <HomeClient initialVariantId={variantId} />;
}
