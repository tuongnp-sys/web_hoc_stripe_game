import { getStripeConfigStatus } from "@/lib/env";
import {
  buildCorsHeaders,
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api-cors";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const status = getStripeConfigStatus();
  return jsonWithCors(request, {
    ...status,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
    cors: buildCorsHeaders(request),
  });
}
