import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export async function sha256Hmac(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function signValue(value: string, secret: string) {
  const signature = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function verifySignedValue(token: string, secret: string) {
  const [value, signature] = token.split(".");
  if (!value || !signature) return false;

  const expected = createHmac("sha256", secret).update(value).digest("hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (signatureBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

export function createSessionToken() {
  return randomBytes(24).toString("hex");
}
