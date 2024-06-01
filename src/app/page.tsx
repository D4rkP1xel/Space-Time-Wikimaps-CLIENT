"use client"

import Result from "@/components/main/Result"
import { useState } from "react"
import { useQuery } from "react-query"
import { getLayers } from "../../utils/customFunctions/layers"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useRouter, useSearchParams } from "next/navigation"
import Paginator from "@/components/other/Paginator"

function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [totalPages, setTotalPages] = useState<number>(1)

  const {
    data: layers,
    isLoading: isLoadingLayers,
    refetch: refetchLayers,
  } = useQuery(
    [
      "layers",
      searchParams.get("search") != null ? searchParams.get("search") : "",
      searchParams.get("page") != null ? Number(searchParams.get("page")) : 1,
    ],
    async () => {
      const data = await getLayers(
        searchParams.get("search"),
        searchParams.get("page")
      )
      setTotalPages(data.totalPages)
      return data.layers
    }
  )

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

          {isLoadingLayers == true ? (
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
          <Paginator
            curPage={
              Number(searchParams.get("page"))
                ? Number(searchParams.get("page"))
                : 1
            }
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  )
}

export default Home
