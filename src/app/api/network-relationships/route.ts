import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import { getNetworkRelationships } from "@/lib/career/dal"

export async function GET(request: Request) {
  const user = await requireUser()
  const url = new URL(request.url)
  const contactId = url.searchParams.get("contactId") || ""
  return NextResponse.json(await getNetworkRelationships(contactId))
}