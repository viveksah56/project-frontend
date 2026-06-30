"use client"

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface Props {
    children: React.ReactNode
}

export default function ReactQueryProvider({ children }: Props) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                gcTime: 1000 * 60 * 5,
                retry: 2,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                refetchOnMount: false,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}