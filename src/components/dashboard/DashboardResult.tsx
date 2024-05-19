import React from "react"
import { FaLock, FaTrash, FaUserEdit, FaUserShield } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import DarkBlueButton from "../buttons/DarkBlueButton"
import { useRouter } from "next/navigation"
import DeclineButton from "../buttons/DeclineButton"
import { FiX } from "react-icons/fi"
import { blockingUser, deletingUser, unblockingUser } from "../../../utils/stateManagement/user"
import toast from "react-hot-toast"
import AcceptButton from "../buttons/AcceptButton"


function DashboardResult({ role, name ,id ,block , refetchFunction }: { role: string; name: string , id: number , block: boolean , refetchFunction: any}) {
  const router = useRouter()
  const [isDeleting, setDeleting] = React.useState(false)
  const [isBlocking, setBlocking] = React.useState(false)
  const [isUnblocking, setUnblocking] = React.useState(false)
  return (
    <>
    <div className="flex w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center mb-6">
      {role === "ADMIN" ? (
        <FaUserShield color="#000000" size={32} />
      ) : role === "EDITOR" ? (
        <FaUserEdit color="#000000" size={32} />
      ) : (
        <FaUser color="#000000" size={32} />
      )}

      <div className="font-medium text-xl ml-3">{name}</div>
      <div className="flex flex-row items-center gap-2 ml-auto">
      {role != "ADMIN" ? (
        <div>
            {block ? (
            <AcceptButton
              onClick={() => setUnblocking(true)}
              logoComponent={<FaLock size={20} />}
              buttonText="Unblock User"
            />
            ) : (
            <DeclineButton
              onClick={() => setBlocking(true)}
              logoComponent={<FaLock size={20} />}
              buttonText="Block User"
            />  )
            }
        </div>
      ) : null}
        <div>
          <DarkBlueButton
            onClick={() => router.push("/profile/" + id)}
            logoComponent={<FaEye size={20} />}
            buttonText="Profile"
          />
        </div>
        <div>
          <DeclineButton
            onClick={() => setDeleting(true)}
            logoComponent={<FaTrash size={20} />}
            buttonText="Delete User"
          />
        </div>
      </div>
    </div>


    {/* Delete Account Modal */}
    {isDeleting === true ? (
      <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
        <div
          className="fixed top-16 right-2 p-8 cursor-pointer"
          onClick={() => {
            setDeleting(false)
          }}>
          <FiX color="#FFFFFF" size={48} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
          <div className="text-2xl font-medium mx-auto mb-6">
            Are you sure you want to delete {name}'s account?
          </div>
          <div
            onClick={async() => {
              try {
              await deletingUser(id)
              refetchFunction()
              setDeleting(false)
              toast.success("User deleted successfully.")
              }catch (error) {
                toast.error("Error deleting user.")
              }
            }}
            className="bg-red-600 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
            {"Delete Account"}
          </div>
        </div>
      </div>
    ) : null}
    {/* End of Password Modal*/}

    {/* Block Account Modal */}
    {isBlocking === true ? (
      <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
        <div
          className="fixed top-16 right-2 p-8 cursor-pointer"
          onClick={() => {
            setBlocking(false)
          }}>
          <FiX color="#FFFFFF" size={48} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
          <div className="text-2xl font-medium mx-auto mb-6">
            Are you sure you want to block {name}'s account?
          </div>
          <div
            onClick={async() => {
              try {
              await blockingUser(id)
              refetchFunction()
              setBlocking(false)
              toast.success("User blocked successfully.")
              }catch (error) {
                toast.error("Error blocking user.")
              }
            }}
            className="bg-red-600 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
            {"Block Account"}
          </div>
        </div>
      </div>
    ) : null}
    {/* End of Block Account Modal*/}

    {/* Unblock Account Modal */}
    {isUnblocking === true ? (
      <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
        <div
          className="fixed top-16 right-2 p-8 cursor-pointer"
          onClick={() => {
            setUnblocking(false)
          }}>
          <FiX color="#FFFFFF" size={48} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
          <div className="text-2xl font-medium mx-auto mb-6">
            Are you sure you want to unblock {name}'s account?
          </div>
          <div
            onClick={async() => {
              try {
              
              await unblockingUser(id)
              refetchFunction()
              setUnblocking(false)
              
              toast.success("User Unblocked successfully.")

              }catch (error) {
                toast.error("Error unblocking user.")
              }
            }}
            className="bg-green-600 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
            {"Unblock Account"}
          </div>
        </div>
      </div>
    ) : null}
    {/* End of Unblock Account Modal*/}
    </> 
  )
}

export default DashboardResult
