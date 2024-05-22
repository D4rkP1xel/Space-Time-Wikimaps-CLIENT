"use client"
import { ReactQueryDevtools } from "react-query/devtools"
import { QueryClient, QueryClientProvider } from "react-query"

import React from "react"
import LayoutWrapper from "./other/LayoutWrapper"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 min
      refetchOnWindowFocus: false,
    },
  },
})
function CustomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <html>
          <body>
            <LayoutWrapper children={children} />
            <ReactQueryDevtools initialIsOpen={false} />
          </body>
        </html>
      </QueryClientProvider>
    </>
  )
}

export default CustomLayout
