import React, { useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { FaUser } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import DarkBlueButton from "../buttons/DarkBlueButton"
import { FaCheck } from "react-icons/fa"
import AcceptButton from "../buttons/AcceptButton"
import DeclineButton from "../buttons/DeclineButton"
import { IoMdClose } from "react-icons/io"
import {
  EditorRequest as IEditorRequest,
  StatusEnum,
  updateEditorRequest,
} from "../../../utils/customFunctions/dashboard"
import { useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
function EditorRequest({
  request,
  refetchEditorRequests,
  curPage,
  curName,
  curStatus,
}: {
  request: IEditorRequest
  refetchEditorRequests: any
  curPage: number
  curName: string
  curStatus: string
}) {
  const router = useRouter()
  const [isDetailsOpened, setDetailsOpened] = useState(false)
  const queryClient = useQueryClient()
  function convertTimeStampToDate(timestamp: string) {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
  }

  const changeRequestStatusMutation = useMutation(
    ({
      status,
      oldRequest,
    }: {
      status: StatusEnum
      oldRequest: IEditorRequest
    }) => _updateEditorRequest(oldRequest.id, status),
    {
      // onMutate is called before the mutation function is fired
      onMutate: async ({
        status,
        oldRequest,
      }: {
        status: StatusEnum
        oldRequest: IEditorRequest
      }): Promise<{ previousData: any }> => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([
          "editorRequests",
          curName,
          curStatus,
          curPage.toString(),
        ])

        // Snapshot the previous value
        const previousData = queryClient.getQueryData([
          "editorRequests",
          curName,
          curStatus,
          curPage.toString(),
        ])
        //console.log(previousData)
        // Optimistically update the cache with the new value
        queryClient.setQueryData(
          ["editorRequests", curName, curStatus, curPage.toString()],
          (oldRequests) => {
            if (Array.isArray(oldRequests)) {
              return oldRequests.map((r: any) => {
                if (r.id == oldRequest.id)
                  return {
                    id: oldRequest.id,
                    userDTO: oldRequest.userDTO,
                    reason: oldRequest.reason,
                    timestamp: oldRequest.timestamp,
                    status: status,
                  }
                else return r
              })
            } else return oldRequests
          }
        )

        // Return a context object with the snapshotted value
        return { previousData }
      },
      // If the mutation fails, use the context we returned from onMutate to roll back
      onError: (err, newData, context) => {
        queryClient.setQueryData(
          ["editorRequests", curName, curStatus, curPage.toString()],
          context?.previousData
        )
      },
      // Always refetch after error or success:
      onSettled: (data, error, context) => {
        queryClient.invalidateQueries([
          "editorRequests",
          curName,
          curStatus,
          curPage.toString(),
        ])
      },
    }
  )

  async function _updateEditorRequest(requestID: number, status: StatusEnum) {
    try {
      await updateEditorRequest(requestID, status)
      //refetchEditorRequests()
      toast.success("Editor Request updated successfully!")
    } catch (error) {
      toast.error("Unknown error while updating Editor Request")
    }
  }

  return (
    <>
      <div className={isDetailsOpened ? "mb-48 relative" : "mb-6 relative"}>
        <div className=" w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center z-20 relative">
          <div className="flex items-center h-full">
            <div
              className={
                request.status == StatusEnum.PENDING
                  ? "mr-4 bg-yellow-400 text-white font-semibold text-sm rounded-full py-1 px-2 select-none"
                  : request.status == StatusEnum.ACCEPTED
                  ? "mr-4 bg-green-500 text-white font-semibold text-sm rounded-full py-1 px-2  select-none"
                  : request.status == StatusEnum.DECLINED
                  ? "mr-4 bg-red-600 text-white font-semibold text-sm rounded-full py-1 px-2  select-none"
                  : "hidden"
              }>
              {request.status}
            </div>
            <div
              className="flex flex-row cursor-pointer"
              onClick={() => router.push("/profile/" + request.userDTO.id)}>
              <FaUser color="#000000" size={32} />
              <div className="font-medium text-xl ml-3">
                {request.userDTO.username}
              </div>
            </div>

            <div
              onClick={() => setDetailsOpened(!isDetailsOpened)}
              className="cursor-pointer w-full h-[76px]"></div>
            <div className="ml-auto flex gap-4 items-center">
              {request.status == StatusEnum.PENDING ? (
                <div className="flex-col flex gap-3">
                  <AcceptButton
                    onClick={() => {
                      changeRequestStatusMutation.mutate({
                        status: StatusEnum.ACCEPTED,
                        oldRequest: request,
                      })
                    }}
                    logoComponent={<FaCheck size={20} />}
                    buttonText="Accept"
                  />
                  <DeclineButton
                    onClick={() => {
                      changeRequestStatusMutation.mutate({
                        status: StatusEnum.DECLINED,
                        oldRequest: request,
                      })
                    }}
                    logoComponent={<IoMdClose size={24} />}
                    buttonText="Decline"
                  />
                </div>
              ) : null}

              {isDetailsOpened ? (
                <IoIosArrowUp
                  className="cursor-pointer"
                  onClick={() => setDetailsOpened(!isDetailsOpened)}
                  color="#000000"
                  size={24}
                />
              ) : (
                <IoIosArrowDown
                  className="cursor-pointer"
                  onClick={() => setDetailsOpened(!isDetailsOpened)}
                  color="#000000"
                  size={24}
                />
              )}
            </div>
          </div>
        </div>
        {isDetailsOpened ? (
          <div className="absolute top-16 bg-gray-300 z-10 pt-24 w-full px-4 pb-2 flex">
            <div className="w-1/2 pr-4">
              <div className="font-bold">Message:</div>
              <textarea
                className="resize-none bg-gray-200 w-full h-28"
                value={request.reason}
                disabled
              />
            </div>
            <div className="w-1/2 pl-4">
              <div className="font-bold">Request Time:</div>
              <div>{convertTimeStampToDate(request.timestamp)}</div>
              <div className="font-bold mt-2">User Profile:</div>
              <div className="mt-2">
                <DarkBlueButton
                  onClick={() => router.push("/profile/" + request.userDTO.id)}
                  logoComponent={<FaEye size={20} />}
                  buttonText="Profile"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default EditorRequest
