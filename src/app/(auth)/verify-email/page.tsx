"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { OTPVerification } from "@/components/ui/otp-input"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("yourname@example.com")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleVerify = async (code: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, email }),
      })

      if (response.ok) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Verification error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to resend code")
      }
    } catch (error) {
      console.error("Resend error:", error)
    }
  }

  return (
    <main className="w-full bg-background flex items-center justify-center min-h-screen font-sans p-4">
      <OTPVerification 
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-background flex items-center justify-center min-h-screen font-sans p-4">
        <div className="w-full max-w-sm h-64 bg-card rounded-2xl animate-pulse"></div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
