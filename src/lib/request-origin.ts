const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cbti.pastorpark.net";

export function getRequestOrigin(headersList: Headers) {
  const host = headersList.get("host");

  if (!host) return fallbackSiteUrl;

  const forwardedProto = headersList.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}
