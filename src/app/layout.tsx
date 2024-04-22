"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </QueryClientProvider>
  )
}
