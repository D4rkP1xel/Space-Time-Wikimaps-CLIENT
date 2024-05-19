"use client"
import React, { use, useEffect, useState } from "react"
import {
  askToBeEditorUser,
  changePasswordUser,
  changeSettingsUser,
  deleteUser,
  getUserByID,
  useUserState,
} from "../../../../utils/stateManagement/user"
import { FaUser, FaUserEdit, FaUserShield } from "react-icons/fa"
import { useQuery } from "react-query"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useCheckAuth } from "../../../../utils/customHooks/checkAuth"
import { useRouter } from "next/navigation"
import { FiLock, FiX } from "react-icons/fi"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import DeclineButton from "@/components/buttons/DeclineButton"
import { FaSave } from "react-icons/fa"
import toast from "react-hot-toast"
import { FaRegTrashAlt } from "react-icons/fa"
function Settings({ params }: { params: { id: string } }) {
  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN", "EDITOR", "USER"])
  const [isChangingPassword, setChangePassword] = useState(false)
  const [isAskingToBeEditor, setAskToBeEditor] = useState(false)
  const useUser = useUserState()
  const [username, setUsername] = useState("")
  const [password, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [canSaveChanges, setSaveChanges] = useState(false)
  const [isLoadingChanges, setLoadingChanges] = useState(false)
  const [isProfileOwner, setIsProfileOwner] = useState<boolean | null>(null)
  const [isDeleting, setDeleting] = useState(false)

  useEffect(() => {
    if (useUser.user != null && params.id != null)
      setIsProfileOwner(useUser.user.id.toString() == params.id)
  }, [useUser.user, params.id])

  useEffect(() => {
    if (
      useUser.user != null &&
      params.id != null &&
      useUser.user.role != "ADMIN" &&
      isProfileOwner != null &&
      isProfileOwner === false
    ) {
      console.log(isProfileOwner + " " + useUser.user.role)
      router.push("/")
      return
    }
  }, [useUser.user, params.id, isProfileOwner])

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

  async function Deleting() {
    try {
      if (useUser.user == null) return
      await deleteUser()
      router.push("/")
      useUser.signOutUser()
    } catch (error) {
      console.error(error)
    }
  }

  async function ChangeSettings(username: string, email: string) {
    try {
      if (useUser.user == null) {
        return
      }
      setLoadingChanges(true)
      await changeSettingsUser(username, email)
      if (isProfileOwner) {
        await useUser.refreshUser()
      } else {
        await refetchUser()
      }
      toast.success("Changes saved successfully!")
      setLoadingChanges(false)
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

  async function AskToBeEditor(message: string) {
    try {
      if (useUser.user == null) return
      await askToBeEditorUser(message)
      setMessage("")
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
      return await getUserByID(params.id)
    },
    {
      enabled:
        !checkAuth.isRenderLoader &&
        isProfileOwner === false &&
        useUser.user != null &&
        useUser.user?.role == "ADMIN" &&
        params.id != null,
    }
  )

  useEffect(() => {
    if (isProfileOwner) {
      setEmail(useUser.user?.email!)
      setUsername(useUser.user?.username!)
    } else if (!isProfileOwner && user != null) {
      setEmail(user.email)
      setUsername(user.username)
    }
  }, [isProfileOwner, user, useUser.user])

  useEffect(() => {
    if (isProfileOwner) {
      let startEmail = useUser.user?.email!
      let startUsername = useUser.user?.username!
      if (startEmail != email || startUsername != username) {
        setSaveChanges(true)
      } else setSaveChanges(false)
    } else if (!isProfileOwner && user != null) {
      let startEmail = user.email
      let startUsername = user.username
      if (startEmail != email || startUsername != username) {
        setSaveChanges(true)
      } else setSaveChanges(false)
    }
  }, [email, username])

  if (checkAuth.isRenderLoader) {
    return <PageCircleLoader />
  } else {
    return (
      <>
        <div className="flex flex-col mb-12 w-full xl:px-48 px-32 pt-12 z-0">
          <div className="font-bold text-4xl mb-12 text-center">Settings</div>
          <div className="flex flex-col mx-auto w-[720px] gap-2 mb-12">
            <div className="flex flex-row">
              <span className=" text-lg font-bold w-16">Name:</span>
              <input
                disabled={!isProfileOwner}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-400 px-2 py-1 rounded w-100 "
                placeholder={
                  isProfileOwner
                    ? useUser.user?.username
                    : isLoadingUser
                    ? ""
                    : user?.username
                }
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
                placeholder={
                  isProfileOwner
                    ? useUser.user?.email
                    : isLoadingUser
                    ? ""
                    : user?.email
                }
              />
            </div>

            <div className="flex flex-row items-center">
              <span className=" text-lg font-bold  w-16">Role:</span>
              <span className=" px-1 py-1 ">
                {isProfileOwner
                  ? useUser.user?.role
                  : isLoadingUser
                  ? null
                  : user?.role}
              </span>
              <div>
                {isProfileOwner && useUser.user?.role ? (
                  useUser.user.role == "ADMIN" ? (
                    <FaUserShield color="#000000" size={24} />
                  ) : useUser.user.role == "EDITOR" ? (
                    <FaUserEdit color="#000000" size={24} />
                  ) : (
                    <FaUser color="#000000" size={24} />
                  )
                ) : user?.role == "ADMIN" ? (
                  <FaUserShield color="#000000" size={24} />
                ) : user?.role == "EDITOR" ? (
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
                      onClick={() => ChangeSettings(username, email)}
                      isDisabled={!canSaveChanges}
                      isLoading={isLoadingChanges}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {isProfileOwner ? (
            <div className="flex flex-col gap-12 justify-center mb-12  w-[720px] mx-auto">
              <div className="flex flex-col ">
                <div className="text-lg font-bold mb-4">Password Settings:</div>
                <DarkBlueButton
                  logoComponent={<FiLock />}
                  buttonText="Change Password"
                  onClick={() => setChangePassword(true)}
                />
              </div>
              {isProfileOwner && useUser.user?.role == "USER" ? (
                <>
                  <div className="flex flex-col">
                    <div className="text-lg font-bold mb-4">
                      Editor Settings:
                    </div>
                    <DarkBlueButton
                      logoComponent={<FaUserEdit size={20} />}
                      buttonText="Ask To Be an Editor"
                      onClick={() => setAskToBeEditor(true)}
                    />
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {isProfileOwner ||
          (useUser.user?.role == "ADMIN" && !(user?.role == "ADMIN")) ? (
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
            <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
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
              <div
                onClick={() => {
                  ChangePassword(password, newPassword)
                }}
                className="bg-cyan-800 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
                {"Change Password"}
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
                setMessage("")
              }}>
              <FiX color="#FFFFFF" size={48} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
              <div className="text-2xl font-medium mx-auto mb-6">
                Ask To Be An Editor
              </div>
              <div className="flex items-center gap-2 py-2 px-2 mb-4">
                <textarea
                  id="description"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border border-gray-400 px-2 py-1 rounded flex-grow w-full h-36"
                  placeholder="Enter a message to the admin to ask to be an Editor"
                />
              </div>
              <div
                onClick={() => {
                  AskToBeEditor(message)
                }}
                className="bg-cyan-800 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
                {"Send"}
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
            <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
              <div className="text-2xl font-medium mx-auto mb-6">
                Are you sure you want to delete your account?
              </div>
              <div
                onClick={() => {
                  Deleting()
                }}
                className="bg-red-600 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
                {"Delete Account"}
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
