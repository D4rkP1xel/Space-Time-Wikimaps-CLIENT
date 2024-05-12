"use client"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useCheckAuth } from "../../../utils/customHooks/checkAuth"
import { useRouter } from "next/navigation"
import { useQuery } from "react-query"
import {
  EditorRequest,
  getAllEditorRequests,
} from "../../../utils/stateManagement/dashboard"
import { useState } from "react"
import EditorRequestComponent from "@/components/editorRequests/EditorRequest"
import { FaSearch } from "react-icons/fa"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"

function EditorRequests() {
  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN"])
  const [name, setName] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value)
  }

  const {
    data: editorRequests,
    isLoading: isLoadingEditorRequests,
    refetch: refetchEditorRequests,
  } = useQuery(
    ["editorRequests"],
    async () => {
      return await getAllEditorRequests(name, selectedStatus)
    },
    { enabled: checkAuth.isRenderLoader() == false }
  )

  if (checkAuth.isRenderLoader()) {
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
              className="bg-gray-100 lg:w-80 md:w-60 w-40 text-black border-none outline-none font-medium"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex ml-12 items-center">
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
              onClick={() => refetchEditorRequests()}
              logoComponent={<FaSearch color="#FFFFFF" size={16} />}
              buttonText="Search"
            />
          </div>
        </div>
        <div className="flex flex-col mt-8">
          {isLoadingEditorRequests ? (
            <PageCircleLoader />
          ) : editorRequests == null || editorRequests.length == 0 ? (
            "No editor requests found"
          ) : (
            editorRequests.map((u: EditorRequest) => (
              <EditorRequestComponent
                key={u.id}
                requestID={u.id}
                name={u.username}
                reason={u.reason}
                timestamp={u.timestamp}
                status={u.status}
              />
            ))
          )}
        </div>
      </div>
    )
  }
}

export default EditorRequests
