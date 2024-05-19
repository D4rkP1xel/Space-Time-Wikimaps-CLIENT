"use client"
import MobileMap from "@/components/layer/MobileMap"
import SideMap from "@/components/main/SideMap"
import Result from "@/components/main/Result"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getLayers } from "../../utils/stateManagement/layers"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useRouter, useSearchParams } from "next/navigation"
import Paginator from "@/components/other/Paginator"

function Home() {
  const [pageWidth, setPageWidth] = useState(window.innerWidth)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09])
  const [isLoadingResultsAux, setIsLoadingResultsAux] = useState(false)
  const [curPage, setCurPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  useEffect(() => {
    function handleResize() {
      setPageWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const {
    data: layers,
    isLoading: isLoadingLayers,
    refetch: refetchLayers,
  } = useQuery(["layers"], async () => {
    setIsLoadingResultsAux(true)
    const data = await getLayers(
      searchParams.get("search"),
      searchParams.get("page")
    )
    setTotalPages(data.totalPages)
    setCurPage(data.currentPage + 1)
    setIsLoadingResultsAux(false)
    return data.layers
  })
  useEffect(() => {
    refetchLayers()
  }, [searchParams.get("search"), searchParams.get("page")])

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
            <div className="font-normal text-2xl mb-2">
              {searchParams.get("search") == null ||
              searchParams.get("search") == ""
                ? null
                : `Results: (results for: ${searchParams.get("search")})`}
            </div>
            {pageWidth > 1024 ? null : (
              <MobileMap center={center} mapLocations={null} />
            )}
            {isLoadingLayers == true || isLoadingResultsAux ? (
              <PageCircleLoader />
            ) : (
              <div className="mt-12">
                {layers != null && layers.length > 0 ? (
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
            <Paginator curPage={curPage} totalPages={totalPages} />
          </div>
        </div>

        {pageWidth > 1024 ? (
          <SideMap center={center} mapLocations={null} />
        ) : null}
      </div>
    </>
  )
}

export default Home
