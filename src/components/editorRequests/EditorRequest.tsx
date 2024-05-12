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
  StatusEnum,
  updateEditorRequest,
} from "../../../utils/stateManagement/dashboard"
function EditorRequest({
  requestID,
  name,
  reason,
  timestamp,
  status,
  refetchEditorRequests,
}: {
  requestID: number
  name: string
  reason: string
  timestamp: string
  status: string
  refetchEditorRequests: any
}) {
  const [isDetailsOpened, setDetailsOpened] = useState(false)

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

  return (
    <>
      <div className={isDetailsOpened ? "mb-48 relative" : "mb-6 relative"}>
        <div className=" w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center z-20 relative">
          <div className="flex items-center h-full">
            <div
              className={
                status == StatusEnum.PENDING
                  ? "mr-4 bg-yellow-400 text-white font-semibold text-sm rounded-full py-1 px-2 select-none"
                  : status == StatusEnum.ACCEPTED
                  ? "mr-4 bg-green-500 text-white font-semibold text-sm rounded-full py-1 px-2  select-none"
                  : status == StatusEnum.DECLINED
                  ? "mr-4 bg-red-600 text-white font-semibold text-sm rounded-full py-1 px-2  select-none"
                  : "hidden"
              }>
              {status}
            </div>
            <FaUser color="#000000" size={32} />
            <div className="font-medium text-xl ml-3">{name}</div>
            <div
              onClick={() => setDetailsOpened(!isDetailsOpened)}
              className="cursor-pointer w-full h-[76px]"></div>
            <div className="ml-auto flex gap-4 items-center">
              {status == StatusEnum.PENDING ? (
                <div className="flex-col flex gap-3">
                  <AcceptButton
                    onClick={async () => {
                      try {
                        await updateEditorRequest(
                          requestID,
                          StatusEnum.ACCEPTED
                        )
                        refetchEditorRequests()
                      } catch (error) {}
                    }}
                    logoComponent={<FaCheck size={20} />}
                    buttonText="Accept"
                  />
                  <DeclineButton
                    onClick={async () => {
                      try {
                        await updateEditorRequest(
                          requestID,
                          StatusEnum.DECLINED
                        )
                        refetchEditorRequests()
                      } catch (error) {}
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
                value={reason}
                disabled
              />
            </div>
            <div className="w-1/2 pl-4">
              <div className="font-bold">Request Time:</div>
              <div>{convertTimeStampToDate(timestamp)}</div>
              <div className="font-bold mt-2">User Profile:</div>
              <div className="mt-2">
                <DarkBlueButton
                  onClick={() => null}
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
