import { useState } from "react"
import {
  FaLock,
  FaTrash,
  FaUnlock,
  FaUserEdit,
  FaUserShield,
} from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import DarkBlueButton from "../buttons/DarkBlueButton"
import { useRouter } from "next/navigation"
import DeclineButton from "../buttons/DeclineButton"
import { FiX } from "react-icons/fi"
import {
  blockUser,
  unblockUser,
  deleteUserById,
  User,
  UserRoleEnum,
} from "../../../utils/stateManagement/user"
import toast from "react-hot-toast"
import AcceptButton from "../buttons/AcceptButton"
import { useMutation, useQueryClient } from "react-query"

function DashboardResult({
  user,
  refetchUsers,
  curPage,
}: {
  user: User
  curPage: number
  refetchUsers: any
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isDeletingModal, setDeletingModal] = useState(false)
  const [isBlockingModal, setBlockingModal] = useState(false)
  const [isUnBlockingModal, setUnBlockingModal] = useState(false)

  const blockMutation = useMutation(
    ({ isBlocking, newUserObj }: { isBlocking: boolean; newUserObj: User }) =>
      _blockUser(isBlocking, newUserObj),
    {
      // onMutate is called before the mutation function is fired
      onMutate: async ({
        isBlocking,
        newUserObj,
      }: {
        isBlocking: boolean
        newUserObj: User
      }): Promise<{ previousData: any }> => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["users", curPage])

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(["users", curPage])
        console.log(previousData)
        // Optimistically update the cache with the new value
        queryClient.setQueryData(["users", curPage], (oldUsers) => {
          if (Array.isArray(oldUsers)) {
            console.log(oldUsers)
            return oldUsers.map((u: any) => {
              if (u.id == newUserObj.id) return newUserObj
              else return u
            })
          } else return oldUsers
        })

        // Return a context object with the snapshotted value
        return { previousData }
      },
      // If the mutation fails, use the context we returned from onMutate to roll back
      onError: (err, newData, context) => {
        queryClient.setQueryData(["users", curPage], context?.previousData)
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(["users", curPage])
      },
    }
  )

  async function _blockUser(isBlocking: boolean, newUserObj: User) {
    try {
      if (isBlocking) await blockUser(user.id)
      else await unblockUser(user.id)
      setBlockingModal(false)
      setUnBlockingModal(false)
      if (isBlocking) toast.success("User blocked successfully.")
      else toast.success("User Unblocked successfully.")
    } catch (error) {
      if (isBlocking) toast.error("Error blocking user.")
      else toast.error("Error unblocking user.")
    }
  }

  return (
    <>
      <div className="flex w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center mb-6">
        {user.role === UserRoleEnum.ADMIN ? (
          <FaUserShield color="#000000" size={32} />
        ) : user.role === UserRoleEnum.EDITOR ? (
          <FaUserEdit color="#000000" size={32} />
        ) : (
          <FaUser color="#000000" size={32} />
        )}

        <div className="font-medium text-xl ml-3">{user.username}</div>
        <div className="flex flex-row items-center gap-2 ml-auto">
          {user.role != UserRoleEnum.ADMIN ? (
            <div>
              {user.blocked ? (
                <AcceptButton
                  onClick={() => setUnBlockingModal(true)}
                  logoComponent={<FaUnlock size={20} />}
                  buttonText="Unblock User"
                />
              ) : (
                <DeclineButton
                  onClick={() => setBlockingModal(true)}
                  logoComponent={<FaLock size={20} />}
                  buttonText="Block User"
                />
              )}
            </div>
          ) : null}
          <div>
            <DarkBlueButton
              onClick={() => router.push("/profile/" + user.id)}
              logoComponent={<FaEye size={20} />}
              buttonText="Profile"
            />
          </div>
          <div>
            <DeclineButton
              onClick={() => setDeletingModal(true)}
              logoComponent={<FaTrash size={20} />}
              buttonText="Delete User"
            />
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeletingModal === true ? (
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() => {
              setDeletingModal(false)
            }}>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
            <div className="text-2xl font-medium mx-auto mb-6">
              Are you sure you want to delete {user.username}'s account?
            </div>
            <div
              onClick={async () => {
                try {
                  await deleteUserById(user.id)
                  refetchUsers()
                  setDeletingModal(false)
                  toast.success("User deleted successfully.")
                } catch (error) {
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
      {isBlockingModal === true ? (
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() => {
              setBlockingModal(false)
            }}>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
            <div className="text-2xl font-medium mx-auto mb-6">
              Are you sure you want to block {user.username}'s account?
            </div>
            <div
              onClick={() => {
                blockMutation.mutate({
                  isBlocking: true,
                  newUserObj: {
                    id: user.id,
                    username: user.username,
                    blocked: true,
                    email: user.email,
                    role: user.role,
                    roleUpgrade: user.roleUpgrade,
                  },
                })
              }}
              className="bg-red-600 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
              {"Block Account"}
            </div>
          </div>
        </div>
      ) : null}
      {/* End of Block Account Modal*/}

      {/* Unblock Account Modal */}
      {isUnBlockingModal === true ? (
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() => {
              setUnBlockingModal(false)
            }}>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
            <div className="text-2xl font-medium mx-auto mb-6">
              Are you sure you want to unblock {user.username}'s account?
            </div>
            <div
              onClick={() => {
                blockMutation.mutate({
                  isBlocking: false,
                  newUserObj: {
                    id: user.id,
                    username: user.username,
                    blocked: false,
                    email: user.email,
                    role: user.role,
                    roleUpgrade: user.roleUpgrade,
                  },
                })
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
