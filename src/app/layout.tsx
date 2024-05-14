"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import "./globals.css"
import CustomLayout from "@/components/CustomLayout"
import { Toaster } from "react-hot-toast"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 300000, // 5 min
        refetchOnWindowFocus: false,
      },
    },
  })

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
