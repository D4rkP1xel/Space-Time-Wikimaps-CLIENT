import Head from "next/head"
import "./globals.css"
import CustomLayout from "@/components/CustomLayout"

import type { Metadata } from "next"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Head>
        <title>WikiMaps</title>
      </Head>
      <CustomLayout children={children} />
    </>
  )
}

export const metadata: Metadata = {
  title: "WikiMaps",
  description:
    "WikiMaps is an innovative platform that combines the vast informational resources of WikiData with the power of an interactive map. Users can visually explore various locations and see search results displayed on the map. ",
}
