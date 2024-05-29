"use client"
import React, { use, useEffect, useState } from "react"
import {
  User,
  UserRoleEnum,
  askToBeEditorUser,
  changePasswordUser,
  changeSettingsUser,
  deleteUser,
  getUserByID,
  useUserState,
} from "../../../../utils/stateManagement/user"
import { FaUser, FaUserEdit, FaUserShield } from "react-icons/fa"
import { useMutation, useQuery, useQueryClient } from "react-query"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useCheckAuth } from "../../../../utils/customHooks/checkAuth"
import { useRouter } from "next/navigation"
import { FiLock, FiX } from "react-icons/fi"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import DeclineButton from "@/components/buttons/DeclineButton"
import { FaSave } from "react-icons/fa"
import toast from "react-hot-toast"
import { FaRegTrashAlt } from "react-icons/fa"
import { StatusEnum } from "../../../../utils/customFunctions/dashboard"
import { IoSend } from "react-icons/io5"
function Settings({ params }: { params: { id: string } }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const checkAuth = useCheckAuth(router, [
    UserRoleEnum.ADMIN,
    UserRoleEnum.EDITOR,
    "USER",
  ])
  const [isChangingPassword, setChangePassword] = useState(false)
  const [isAskingToBeEditor, setAskToBeEditor] = useState(false)
  const useUser = useUserState()
  const [username, setUsername] = useState("")
  const [password, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [email, setEmail] = useState("")
  const [askToBeEditorRequestMessage, setAskToBeEditorRequestMessage] =
    useState("")
  const [canSaveChanges, setSaveChanges] = useState(false)
  const [isLoadingChanges, setLoadingChanges] = useState(false)
  const [isProfileOwner, setIsProfileOwner] = useState<boolean | null>(null)
  const [isDeleting, setDeleting] = useState(false)
  const [isWaiting7Days, setWaiting7Days] = useState(false)
  const [timeLeftForNewEditorRequest, setTimeLeftForNewEditorRequest] =
    useState(new Date().toISOString())

  const askToBeEditorMutation = useMutation(
    ({ message, newUserObj }: { message: string; newUserObj: User }) =>
      AskToBeEditor(message, newUserObj),
    {
      // onMutate is called before the mutation function is fired
      onMutate: async ({
        message,
        newUserObj,
      }: {
        message: string
        newUserObj: User
      }): Promise<{ previousData: any }> => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([
          "user_settings",
          newUserObj.id.toString(),
        ])

        // Snapshot the previous value
        const previousData = queryClient.getQueryData([
          "user_settings",
          newUserObj.id.toString(),
        ])
        //console.log(previousData)
        // Optimistically update the cache with the new value
        queryClient.setQueryData(
          ["user_settings", newUserObj.id.toString()],
          newUserObj
        )

        // Return a context object with the snapshotted value
        return { previousData }
      },
      // If the mutation fails, use the context we returned from onMutate to roll back
      onError: (err, newData, context) => {
        queryClient.setQueryData(
          ["user_settings", context?.previousData.id.toString()],
          context?.previousData
        )
      },
      // Always refetch after error or success:
      onSettled: (data, error, context) => {
        queryClient.invalidateQueries([
          "user_settings",
          context.newUserObj.id.toString(),
        ])
      },
    }
  )

  const changeSettingsMutation = useMutation(
    ({ newUserObj, oldUser }: { newUserObj: User; oldUser: User }) =>
      ChangeSettings(newUserObj.username, newUserObj.email, oldUser),
    {
      // onMutate is called before the mutation function is fired
      onMutate: async ({
        newUserObj,
      }: {
        newUserObj: User
      }): Promise<{ previousData: any }> => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([
          "user_settings",
          newUserObj.id.toString(),
        ])

        // Snapshot the previous value
        const previousData = queryClient.getQueryData([
          "user_settings",
          newUserObj.id.toString(),
        ])
        //console.log(previousData)
        // Optimistically update the cache with the new value
        queryClient.setQueryData(
          ["user_settings", newUserObj.id.toString()],
          newUserObj
        )

        // Return a context object with the snapshotted value
        return { previousData }
      },
      // If the mutation fails, use the context we returned from onMutate to roll back
      onError: (err, newData, context) => {
        queryClient.setQueryData(
          ["user_settings", context?.previousData.id.toString()],
          context?.previousData
        )
      },
      // Always refetch after error or success:
      onSettled: (data, error, context) => {
        queryClient.invalidateQueries([
          "user_settings",
          context.newUserObj.id.toString(),
        ])
      },
    }
  )

  useEffect(() => {
    if (useUser.user != null && params.id != null)
      setIsProfileOwner(useUser.user.id.toString() == params.id)
  }, [useUser.user, params.id])

  useEffect(() => {
    if (
      useUser.user != null &&
      params.id != null &&
      useUser.user.role != UserRoleEnum.ADMIN &&
      isProfileOwner != null &&
      isProfileOwner === false
    ) {
      console.log(isProfileOwner + " " + useUser.user.role)
      router.push("/")
      return
    }
  }, [useUser.user, params.id, isProfileOwner])

  function UpdateTimeLeftForNewEditorRequest() {
    if (!useUser.user?.roleUpgrade) return

    const requestTime = new Date(useUser.user.roleUpgrade.timestamp)
    const nextRequestTime = new Date(requestTime)
    nextRequestTime.setDate(requestTime.getDate() + 7) // Add 7 days for next request

    const currentTime = new Date()

    // Calculate the difference in milliseconds
    const difference = nextRequestTime.getTime() - currentTime.getTime()

    // If difference is negative, set all values to 0
    if (difference < 0) {
      setTimeLeftForNewEditorRequest("")
      setWaiting7Days(false)
      return
    }

    // Calculate the time components
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    setTimeLeftForNewEditorRequest(days + "D:" + hours + "H:" + minutes + "M")
    setWaiting7Days(true)
  }

  useEffect(() => {
    // Function to update the time
    const updateCurrentTime = () => {
      UpdateTimeLeftForNewEditorRequest()
    }

    if (useUser.user?.roleUpgrade == null) return
    // Call the function immediately
    updateCurrentTime()

    // Set an interval to call the function once per minute
    const intervalId = setInterval(updateCurrentTime, 60000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [useUser.user])

  async function ChangePassword(
    oldPasswordParam: string,
    newPasswordParam: string
  ) {
    try {
      if (useUser.user == null) return
      await changePasswordUser(
        useUser.user?.id.toString(),
        oldPasswordParam,
        newPasswordParam
      )
      setOldPassword("")
      setNewPassword("")
      setChangePassword(false)
      toast.success("Password changed successfully!")
    } catch (error) {
      if (
        typeof error === "string" &&
        (error == "One or more camps are empty." ||
          error == "New Password length has to be at least 6 characters long.")
      ) {
        toast.error(error)
      } else toast.error("Unknown Error.")
    }
  }

  async function DeleteUser() {
    try {
      if (useUser.user == null) return
      await deleteUser()
      router.push("/")
      useUser.signOutUser()
    } catch (error) {
      console.error(error)
    }
  }

  async function ChangeSettings(username: string, email: string, user: User) {
    try {
      if (useUser.user == null) {
        throw "User not found"
      }
      if (username == null || username == "" || email == null || email == "") {
        throw "One or more camps are empty."
      }
      let obj: { username?: string; email?: string } = {}
      if (username != user.username) obj["username"] = username
      if (email != user.email) obj["email"] = email
      await changeSettingsUser(obj)
      if (isProfileOwner) {
        await useUser.refreshUser()
      }

      toast.success("Changes saved successfully!")
    } catch (error) {
      if (
        typeof error === "string" &&
        (error == "One or more camps are empty." ||
          error.startsWith("Validation failed:") ||
          error == "Username already exists." ||
          error == "Email already registered.")
      ) {
        toast.error(error)
      } else toast.error("Unknown Error. Try later.")
      setLoadingChanges(false)
    }
  }

  async function AskToBeEditor(message: string, newUserObj: User) {
    try {
      if (useUser.user == null) return
      await askToBeEditorUser(message)
      setAskToBeEditorRequestMessage("")
      setAskToBeEditor(false)
      toast.success("Request sent successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Unknown Error. Try later.")
    }
  }

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery(
    ["user_settings", params.id],
    async () => {
      const userAux = await getUserByID(params.id)
      if (userAux?.email) setEmail(userAux.email)
      if (userAux?.username) setUsername(userAux.username)
      return userAux
    },
    {
      enabled:
        !checkAuth.isRenderLoader &&
        (isProfileOwner === true ||
          (isProfileOwner === false &&
            useUser.user != null &&
            useUser.user.role == UserRoleEnum.ADMIN)) &&
        params.id != null,
      refetchOnMount: "always",
    }
  )

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setUsername(user.username)
    }
  }, [user])
  useEffect(() => {
    if (user != null) {
      let startEmail = user.email
      let startUsername = user.username
      if (startEmail != email || startUsername != username) {
        setSaveChanges(true)
      } else setSaveChanges(false)
    } else setSaveChanges(false)
  }, [email, username])

  if (checkAuth.isRenderLoader) {
    return <PageCircleLoader />
  } else {
    return (
      <>
        <div className="flex flex-col mb-12 w-full xl:px-48 px-32 pt-12 z-0">
          <div className="font-bold text-4xl mb-12 text-center">Settings</div>
          <div className="flex flex-col mx-auto xl:ml-40 lg:ml-32 md:ml-20 ml-0 gap-2 mb-12">
            <div className="flex flex-row">
              <span className=" text-lg font-bold w-16">Name:</span>
              <input
                disabled={!isProfileOwner}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-400 px-2 py-1 rounded w-100 "
                placeholder={isLoadingUser ? "" : user?.username}
              />
            </div>

            <div className="flex flex-row ">
              <span className=" text-lg font-bold w-16">Email:</span>
              <input
                disabled={!isProfileOwner}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-400 px-2 py-1 rounded w-100"
                placeholder={isLoadingUser ? "" : user?.email}
              />
            </div>

            <div className="flex flex-row items-center">
              <span className=" text-lg font-bold  w-16">Role:</span>
              <span className=" px-1 py-1 ">
                {isLoadingUser ? null : user?.role}
              </span>
              <div>
                {user?.role == UserRoleEnum.ADMIN ? (
                  <FaUserShield color="#000000" size={24} />
                ) : user?.role == UserRoleEnum.EDITOR ? (
                  <FaUserEdit color="#000000" size={24} />
                ) : (
                  <FaUser color="#000000" size={24} />
                )}
              </div>
            </div>
            {isProfileOwner ? (
              <>
                <div className="flex flex-row">
                  <div className="flex flex-row ">
                    <DarkBlueButton
                      logoComponent={<FaSave size={20} />}
                      buttonText="Save Changes"
                      onClick={() => {
                        if (user == null) return null
                        return changeSettingsMutation.mutate({
                          newUserObj: {
                            id: user.id,
                            blocked: user.blocked,
                            email: email,
                            role: user.role,
                            roleUpgrade: user.roleUpgrade,
                            username: username,
                          },
                          oldUser: user,
                        })
                      }}
                      isDisabled={!canSaveChanges}
                      isLoading={isLoadingChanges}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {isProfileOwner ? (
            <div className="flex flex-col gap-12 justify-center mb-12 xl:ml-40 lg:ml-32 md:ml-20 ml-0 mx-auto">
              <div className="flex flex-col ">
                <div className="text-lg font-bold mb-4">Password Settings:</div>
                <DarkBlueButton
                  logoComponent={<FiLock />}
                  buttonText="Change Password"
                  onClick={() => setChangePassword(true)}
                />
              </div>
              {useUser.user?.role == "USER" ? (
                <>
                  <div className="flex flex-col">
                    <div className="text-lg font-bold mb-4">
                      Editor Settings:
                    </div>
                    <DarkBlueButton
                      logoComponent={<FaUserEdit size={20} />}
                      buttonText="Ask To Be an Editor"
                      onClick={() => setAskToBeEditor(true)}
                      isDisabled={
                        isWaiting7Days ||
                        user?.roleUpgrade?.status == StatusEnum.PENDING
                      }
                    />
                    {user?.roleUpgrade?.status == "DECLINED" ? (
                      <>
                        <div className="flex flex-row gap-1 mt-1">
                          <div className=" text-black text-sm ">
                            You can ask again in:
                          </div>
                          <div className="text-sm font-bold text-red-500   ">
                            {timeLeftForNewEditorRequest}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {user?.roleUpgrade != null ? (
                    <div className="text-lg font-bold">
                      Admin Response: {user.roleUpgrade?.status}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}

          {isProfileOwner ||
          (useUser.user?.role == UserRoleEnum.ADMIN &&
            !(user?.role == UserRoleEnum.ADMIN)) ? (
            <div className="flex justify-center">
              <DeclineButton
                logoComponent={<FaRegTrashAlt size={20} />}
                buttonText="Delete Account"
                onClick={() => setDeleting(true)}
              />
            </div>
          ) : null}
        </div>
        {/* Change Password Modal */}
        {isChangingPassword === true ? (
          <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
            <div
              className="fixed top-16 right-2 p-8 cursor-pointer"
              onClick={() => {
                setChangePassword(false)
                setOldPassword("")
                setNewPassword("")
              }}>
              <FiX color="#FFFFFF" size={48} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
              <div className="text-2xl font-medium mx-auto mb-6">
                Change Password
              </div>
              <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                <FiLock color="#000000" size={16} />
                <input
                  type="password"
                  placeholder="Old Password"
                  className="bg-[#EFF6FF] w-full outline-none"
                  value={password}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                <FiLock color="#000000" size={16} />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#EFF6FF] w-full outline-none"
                />
              </div>
              <div className="flex justify-center">
                <DarkBlueButton
                  buttonText="Change Password"
                  onClick={() => ChangePassword(password, newPassword)}
                  logoComponent={<FiLock color="#FFFFFF" size={20} />}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* End of Password Modal*/}

        {/* Ask To Be Editor Modal */}
        {isAskingToBeEditor === true ? (
          <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
            <div
              className="fixed top-16 right-2 p-8 cursor-pointer"
              onClick={() => {
                setAskToBeEditor(false)
                setAskToBeEditorRequestMessage("")
              }}>
              <FiX color="#FFFFFF" size={48} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
              <div className="text-2xl font-medium mx-auto mb-6">
                Ask To Be An Editor
              </div>
              <div className="flex items-center gap-2 py-2 px-2 mb-4">
                <textarea
                  id="description"
                  value={askToBeEditorRequestMessage}
                  onChange={(e) =>
                    setAskToBeEditorRequestMessage(e.target.value)
                  }
                  className="border border-gray-400 px-2 py-1 rounded flex-grow w-full h-36"
                  placeholder="Enter a message to the admin to ask to be an Editor"
                />
              </div>
              <div className="flex justify-center">
                <DarkBlueButton
                  buttonText="Send Request"
                  onClick={() => {
                    if (useUser.user == null) return null
                    askToBeEditorMutation.mutate({
                      message: askToBeEditorRequestMessage,
                      newUserObj: {
                        id: useUser.user.id,
                        blocked: useUser.user.blocked,
                        email: useUser.user.email,
                        role: useUser.user.role,
                        roleUpgrade: {
                          id: -1,
                          reason: "",
                          timestamp: "",
                          userDTO: useUser.user,
                          status: StatusEnum.PENDING,
                        },
                        username: useUser.user.username,
                      },
                    })
                  }}
                  logoComponent={<IoSend color="#FFFFFF" size={20} />}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* End of Ask to be Editor Modal*/}

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
            <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
              <div className="text-2xl font-medium mx-auto mb-6">
                Are you sure you want to delete your account?
              </div>
              <div className="flex justify-center">
                <DeclineButton
                  logoComponent={<FaRegTrashAlt size={20} />}
                  buttonText="Delete Account"
                  onClick={() => {
                    DeleteUser()
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* End of Password Modal*/}
      </>
    )
  }
}

export default Settings
