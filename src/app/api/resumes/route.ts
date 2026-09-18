import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import { getResumeVersions } from "@/lib/career/dal"

export async function GET(request: Request) {
  const user = await requireUser()
  const url = new URL(request.url)
  const masterResumeId = url.searchParams.get("masterResumeId") || ""
  return NextResponse.json(await getResumeVersions(masterResumeId))
}