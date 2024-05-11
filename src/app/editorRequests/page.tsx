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

function EditorRequests() {
  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN"])
  const [name, setName] = useState("")
  const {
    data: editorRequests,
    isLoading: isLoadingEditorRequests,
    refetch: refetchEditorRequests,
  } = useQuery(
    ["editorRequests"],
    async () => {
      return await getAllEditorRequests(name)
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
