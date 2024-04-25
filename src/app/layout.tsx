"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import "./globals.css"
import CustomLayout from "@/components/CustomLayout"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>
          <CustomLayout children={children} />
        </body>
      </html>
    </QueryClientProvider>
  )
}
