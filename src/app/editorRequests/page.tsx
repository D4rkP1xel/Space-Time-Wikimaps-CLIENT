"use client"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useCheckAuth } from "../../../utils/customHooks/useCheckAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "react-query"
import {
  EditorRequest,
  getAllEditorRequests,
} from "../../../utils/customFunctions/dashboard"
import { useEffect, useState } from "react"
import EditorRequestComponent from "@/components/editorRequests/EditorRequest"
import { FaSearch } from "react-icons/fa"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import Paginator from "@/components/other/Paginator"
import { UserRoleEnum } from "../../../utils/stateManagement/user"

function EditorRequests() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkAuth = useCheckAuth(router, [UserRoleEnum.ADMIN])
  const [name, setName] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isLoadingResultsAux, setIsLoadingResultsAux] = useState(false)

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value)
  }

  function changeToUrlParam(urlName: string, value: string) {
    const currentUrl = window.location.href

    // Create a new URL object
    const url = new URL(currentUrl)

    // Get the search parameters from the URL
    const searchParams = new URLSearchParams(url.search)

    // Set or update the query parameter
    searchParams.set(urlName, value)

    // Update the URL object with the new search parameters
    url.search = searchParams.toString()

    // Use history.pushState to update the browser's URL without reloading the page
    history.pushState({}, "", url.toString())
  }

  const {
    data: editorRequests,
    isLoading: isLoadingEditorRequests,
    refetch: refetchEditorRequests,
  } = useQuery(
    [
      "editorRequests",
      searchParams.get("name") != null ? searchParams.get("name") : "",
      searchParams.get("status") != null ? searchParams.get("status") : "",
      searchParams.get("page") != null ? searchParams.get("page") : "1",
    ],
    async () => {
      const data = await getAllEditorRequests(
        searchParams.get("name") != null ? searchParams.get("name") : "",
        searchParams.get("status") != null ? searchParams.get("status") : "",
        searchParams.get("page")
      )
      if (data == null) {
        changeToUrlParam("page", "1")

        setIsLoadingResultsAux(false)
        refetchEditorRequests()

        return { requests: [], totalPages: 1 }
      }
      //console.log(data)
      return data
    },
    { enabled: checkAuth.isRenderLoader == false }
  )

  // useEffect(() => {
  //   refetchEditorRequests()
  // }, [searchParams.get("page")])
  useEffect(() => {
    let aux = searchParams.get("name")
    if (aux != null) {
      setName(aux)
    }
  }, [searchParams.get("name")])

  useEffect(() => {
    let aux = searchParams.get("status")
    if (aux != null) {
      setSelectedStatus(aux)
    }
  }, [searchParams.get("status")])

  if (checkAuth.isRenderLoader) {
    return <PageCircleLoader />
  } else {
    return (
      <div className="flex flex-col w-full xl:px-24 px-12 pt-12">
        <div className="text-4xl font-medium text-center w-full">
          Editor Requests
        </div>
        <div className="flex mt-12">
          <div className="flex gap-4 bg-gray-100 items-center py-1 pl-4 pr-1 rounded-full">
            <FaSearch color="#000000" size={16} />
            <input
              type="text"
              className="bg-gray-100 lg:w-80 md:w-60 w-32 text-black border-none outline-none font-medium"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex md:ml-12 ml-4 items-center">
            <div className="font-medium text-md mr-2">Status:</div>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border-black border-2 outline-none w-32">
              <option value="">All</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="PENDING">Pending</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>
          <div className="ml-auto">
            <DarkBlueButton
              onClick={() => {
                changeToUrlParam("name", name != null ? name : "")
                changeToUrlParam(
                  "status",
                  selectedStatus != null ? selectedStatus : ""
                )
                changeToUrlParam("page", "1")
                refetchEditorRequests()
              }}
              logoComponent={<FaSearch color="#FFFFFF" size={16} />}
              buttonText="Search"
            />
          </div>
        </div>
        <div className="flex flex-col mt-8">
          {isLoadingEditorRequests || isLoadingResultsAux ? (
            <PageCircleLoader />
          ) : !editorRequests ||
            editorRequests.requests == null ||
            editorRequests.requests.length == 0 ? (
            "No editor requests found"
          ) : (
            editorRequests.requests.map((u: EditorRequest) => (
              <EditorRequestComponent
                key={u.id}
                request={u}
                refetchEditorRequests={refetchEditorRequests}
                curPage={
                  searchParams.get("page") != null
                    ? Number(searchParams.get("page"))
                    : 1
                }
                curName={searchParams.get("name") || ""}
                curStatus={searchParams.get("status") || ""}
              />
            ))
          )}
        </div>
        <Paginator
          curPage={
            searchParams.get("page") != null
              ? Number(searchParams.get("page"))
              : 1
          }
          totalPages={
            editorRequests && editorRequests.totalPages
              ? editorRequests.totalPages
              : 1
          }
          scrollToTop={true}
        />
      </div>
    )
  }
}

export default EditorRequests
