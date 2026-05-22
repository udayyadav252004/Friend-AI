import { NextResponse } from "next/server";
import { listCheckInMetrics } from "@/lib/services/checkin-service";

export const runtime = "edge";

export async function GET() {
  const metrics = await listCheckInMetrics();
  return NextResponse.json(metrics);
}
