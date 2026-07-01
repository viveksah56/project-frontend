import * as React from "react"
import {TooltipProvider} from "@/components/ui/tooltip"
import ReactQueryProvider from "./query-provider"
import {ThemeProvider} from "./theme-provider"
import {Toaster} from "@/components/ui/sonner"
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GOOGLE_CLIENT_ID} from "@/utils/constant";
import {AuthProvider} from "@/context/auth.context";

interface RootProviderProps {
  children: React.ReactNode
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <ReactQueryProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  )
}
