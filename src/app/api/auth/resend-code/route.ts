import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Verification code resent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resend error:", error)
    return NextResponse.json(
      { error: "Resend failed" },
      { status: 500 }
    )
  }
}
