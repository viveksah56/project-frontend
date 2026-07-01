import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json()

    if (!code || !email) {
      return NextResponse.json(
        { error: "Missing code or email" },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
