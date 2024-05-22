"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import "./globals.css"
import CustomLayout from "@/components/CustomLayout"
import { ReactQueryDevtools } from "react-query/devtools"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 min
      refetchOnWindowFocus: false,
    },
  },
})
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>
          <CustomLayout children={children} />
          <ReactQueryDevtools initialIsOpen={false} />
        </body>
      </html>
    </QueryClientProvider>
  )
}
