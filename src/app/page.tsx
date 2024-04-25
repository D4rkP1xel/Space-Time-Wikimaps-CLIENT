"use client"
import MobileMap from "@/components/layer/MobileMap"
import Map from "@/components/main/Map"
import Result from "@/components/main/Result"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getLayers } from "../../utils/stateManagement/layers"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useRouter } from "next/navigation"
function Home() {
  const [pageWidth, setPageWidth] = useState(window.innerWidth)
  const router = useRouter()
  useEffect(() => {
    function handleResize() {
      setPageWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const { data: layers, isLoading: isLoadingLayers } = useQuery(
    ["layers"],
    async () => await getLayers()
  )

  return (
    <>
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
            {isLoadingLayers == true ? (
              <PageCircleLoader />
            ) : (
              <div className="mt-12">
                {layers != null ? (
                  layers.map((l) => {
                    return (
                      <Result
                        key={l.id}
                        name={l.layerName}
                        description={l.description}
                        layerId={l.id}
                        router={router}
                      />
                    )
                  })
                ) : (
                  <div>No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
        {pageWidth > 1024 ? <Map /> : null}
      </div>
    </>
  )
}

export default Home
