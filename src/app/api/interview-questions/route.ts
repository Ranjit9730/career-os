import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import { getInterviewQuestions } from "@/lib/career/dal"

export async function GET(request: Request) {
  const user = await requireUser()
  const url = new URL(request.url)
  const sessionId = url.searchParams.get("sessionId") || ""
  return NextResponse.json(await getInterviewQuestions(sessionId))
}