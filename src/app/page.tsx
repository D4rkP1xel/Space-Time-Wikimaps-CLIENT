"use client"
import MobileMap from "@/components/layer/MobileMap"
import Header from "@/components/main/Header"
import Map from "@/components/main/Map"
import Result from "@/components/main/Result"
import { useEffect, useState } from "react"

function Home() {
  const [pageWidth, setPageWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setPageWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <Header />

      <div className="flex">
        <div
          className="flex w-full pr-12 xl:pl-24 pl-12 pt-12 z-0"
          style={
            pageWidth > 1280
              ? { width: `calc(100% - 300px)` }
              : pageWidth > 1024
              ? { width: `calc(100% - 200px)` }
              : { width: "100%" }
          }>
          <div
            className={pageWidth > 1024 ? "w-full pr-48 z-10" : "w-full z-10"}>
            <div className="font-normal text-2xl mb-2">Results:</div>
            {pageWidth > 1024 ? null : <MobileMap />}
            <div className="mt-12">
              <Result />
              <Result />
              <Result />
              <Result />
              <Result />
            </div>
          </div>
        </div>
        {pageWidth > 1024 ? <Map /> : null}
      </div>
    </>
  )
}

export default Home
