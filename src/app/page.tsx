"use client"

import Result from "@/components/main/Result"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getLayers } from "../../utils/stateManagement/layers"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useRouter, useSearchParams } from "next/navigation"
import Paginator from "@/components/other/Paginator"
import MobileMap from "@/components/Maps/MobileMap"
import SideMap from "@/components/Maps/SideMap"
import MapFullScreen from "@/components/Maps/MapFullScreen"

function Home() {
  const [pageWidth, setPageWidth] = useState(window.innerWidth)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09])
  const [isLoadingResultsAux, setIsLoadingResultsAux] = useState(false)
  const [curPage, setCurPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isFullscreen, setFullscreen] = useState(false)

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
      <div className="flex w-full px-12 xl:px-24 pt-12 z-0">
        <div className="w-full z-10">
          <div className="font-normal text-2xl mb-2">
            {searchParams.get("search") == null ||
            searchParams.get("search") == ""
              ? "Results:"
              : `Results: (results for: ${searchParams.get("search")})`}
          </div>

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
                      curPage={
                        searchParams.get("page")
                          ? searchParams.get("page") + ""
                          : "1"
                      }
                      curSearch={
                        searchParams.get("search")
                          ? searchParams.get("search") + ""
                          : ""
                      }
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
    </>
  )
}

export default Home
