import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/require-user"
import { getInterviewAnswers } from "@/lib/career/dal"

export async function GET(request: Request) {
  const user = await requireUser()
  const url = new URL(request.url)
  const questionId = url.searchParams.get("questionId") || ""
  return NextResponse.json(await getInterviewAnswers(questionId))
}