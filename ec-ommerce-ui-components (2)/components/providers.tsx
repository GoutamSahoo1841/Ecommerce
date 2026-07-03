'use client'

import { ThemeProvider } from 'next-themes'
import { StoreProvider } from '@/lib/store'
import { Toaster } from '@/components/ui/sonner'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        {children}
        <Toaster position="bottom-right" />
      </StoreProvider>
    </ThemeProvider>
  )
}
