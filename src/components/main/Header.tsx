"use client"

import { useEffect, useState } from "react"
import { FaSearch, FaUserEdit } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { FaRegUser } from "react-icons/fa"
import { FiUser } from "react-icons/fi"
import { FaUserShield } from "react-icons/fa"
import { FaSignInAlt } from "react-icons/fa"
import { FaUserPlus } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { FiMail } from "react-icons/fi"
import { FiLock } from "react-icons/fi"
import { UserRoleEnum, useUserState } from "../../../utils/stateManagement/user"
import { FiLogOut } from "react-icons/fi"
import { TbTablePlus } from "react-icons/tb"
import { useRouter } from "next/navigation"
import { FaUsers, FaTicketAlt } from "react-icons/fa"
import toast from "react-hot-toast"
import { FiSettings } from "react-icons/fi"
import { AxiosError } from "axios"

import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io"
function Header() {
  const router = useRouter()
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [isLogin, setLogin] = useState(false)
  const [isRegister, setRegister] = useState(false)
  const useUser = useUserState()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [email, setEmail] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const handleClick = (event: Event) => {
      event.stopPropagation()
      if (isMenuOpened) setMenuOpened(false)
    }

    // Add event listener when component mounts
    document.addEventListener("click", handleClick)

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [isMenuOpened]) // Empty dependency array to run effect only once

  function setLoginState(state: boolean) {
    setLogin(state)
    setRegister(false)
    setMenuOpened(false)
  }

  function setRegisterState(state: boolean) {
    setLogin(false)
    setRegister(state)
    setMenuOpened(false)
  }

  async function handleSignIn(usernameParam: string, passwordParam: string) {
    try {
      await useUser.signInUser(usernameParam, passwordParam)
      setLogin(false)
      setRegister(false)
      setMenuOpened(false)
      setUsername("")
      setPassword("")
      toast.success("Welcome " + usernameParam + "!")
    } catch (error) {
      if (
        typeof error === "string" &&
        error == "Fill in all necessary fields."
      ) {
        toast.error(error)
      } else if (
        error instanceof AxiosError &&
        error?.response?.status == 403
      ) {
        toast.error("You have been blocked")
      } else toast.error("Unknown Error. Try later.")
      // console.error(error)
    }
  }

  async function handleRegister(
    usernameParam: string,
    passwordParam: string,
    repeatPasswordParam: string,
    emailParam: string
  ) {
    try {
      const response = await useUser.registerUser(
        usernameParam,
        passwordParam,
        repeatPasswordParam,
        emailParam
      )
      console.log(response)

      setLogin(false)
      setRegister(false)
      setMenuOpened(false)
      setUsername("")
      setEmail("")
      setPassword("")
      setRepeatPassword("")
      toast.success("Account created successfully. Log in to your account.")
    } catch (error) {
      if (
        typeof error === "string" &&
        (error == "Fill in all necessary fields." ||
          error == "Passwords do not match." ||
          error.startsWith("Validation failed:") ||
          error == "Username already exists." ||
          error == "Email already registered." ||
          error == "Unknown Error.")
      ) {
        toast.error(error)
      } else toast.error("Unknown Error. Try later.")
    }
  }

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault() // Prevent form submission
      router.push("/?search=" + search)
    }
  }

  return (
    <>
      <div className="h-20 bg-cyan-700 w-full flex items-center px-8">
        <div
          onClick={() => router.push("/")}
          className="font-extrabold text-2xl text-white mr-8 select-none cursor-pointer">
          WIKIMAPS
        </div>
        <div className="flex gap-4 bg-cyan-900 items-center py-1 pl-4 pr-1 rounded-full">
          <FaSearch
            onClick={() => router.push("/?search=" + search)}
            className="cursor-pointer"
            color="#FFFFFF"
            size={16}
          />
          <input
            type="text"
            className="bg-cyan-900 lg:w-80 md:w-60 w-40 text-white border-none outline-none"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div
          className="ml-auto flex items-center cursor-pointer"
          onClick={() => setMenuOpened(!isMenuOpened)}>
          {useUser.isUserAuth() ? (
            <div className="text-white font-medium text-base select-none">
              {useUser.user?.username}
            </div>
          ) : null}

          <div className="p-2">
            {useUser.isUserAuth() &&
            useUser.user?.role == UserRoleEnum.ADMIN ? (
              <FaUserShield color="#FFFFFF" size={24} />
            ) : useUser.isUserAuth() &&
              useUser.user?.role == UserRoleEnum.EDITOR ? (
              <FaUserEdit color="#FFFFFF" size={24} />
            ) : (
              <FaUser color="#FFFFFF" size={24} />
            )}
          </div>
          <div className="relative top-[6px] right-2">
            {isMenuOpened ? (
              <IoMdArrowDropup size={20} color="#FFFFFF" />
            ) : (
              <IoMdArrowDropdown size={20} color="#FFFFFF" />
            )}
          </div>
        </div>

        <div className={isMenuOpened ? "relative" : "hidden"}>
          <div className="absolute bg-slate-50 shadow-md shadow-[#828282] rounded-md w-60 right-8 top-3 py-4 px-3 z-50">
            {useUser.isUserAuth() ? (
              <>
                <div
                  className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                  onClick={() => router.push("/profile/" + [useUser.user?.id])}>
                  <FaUser color="#000000" size={16} />
                  <div className="font-semibold select-none">Profile</div>
                </div>
                {useUser.user?.role == UserRoleEnum.ADMIN ||
                useUser.user?.role == UserRoleEnum.EDITOR ? (
                  <div
                    className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                    onClick={() => router.push("/createLayer")}>
                    <TbTablePlus color="#000000" size={16} />
                    <div className="font-semibold select-none">
                      Create Layer
                    </div>
                  </div>
                ) : null}
                {useUser.user?.role == UserRoleEnum.ADMIN ? (
                  <>
                    <div
                      className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                      onClick={() => router.push("/dashboard")}>
                      <FaUsers color="#000000" size={16} />
                      <div className="font-semibold select-none">
                        User Dashboard
                      </div>
                    </div>
                    <div
                      className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                      onClick={() => router.push("/editorRequests")}>
                      <FaTicketAlt color="#000000" size={16} />
                      <div className="font-semibold select-none">
                        Editor Requests
                      </div>
                    </div>
                  </>
                ) : null}
                <div id="settings"
                  className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                  onClick={() =>
                    router.push("/settings/" + [useUser.user?.id])
                  }>
                  <FiSettings color="#000000" size={16} />
                  <div className="font-semibold select-none">Settings</div>
                </div>
                <div
                  className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                  onClick={() => {
                    useUser.signOutUser()
                    setMenuOpened(false)
                  }}>
                  <FiLogOut color="#000000" size={16} />
                  <div className="font-semibold select-none">Logout</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                  onClick={() => setLoginState(true)}>
                  <FaSignInAlt color="#000000" size={16} />
                  <div className="font-semibold select-none">Login</div>
                </div>
                <div
                  className="flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-1"
                  onClick={() => setRegisterState(true)}>
                  <FaUserPlus color="#000000" size={16} />
                  <div className="font-semibold select-none">Register</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isRegister === true || isLogin === true ? (
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() => {
              isRegister ? setRegisterState(false) : setLoginState(false)
              setUsername("")
              setRepeatPassword("")
              setPassword("")
              setEmail("")
            }}>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
            <div className="text-2xl font-medium mx-auto mb-6">
              {isRegister ? "Register" : "Login"}
            </div>
            {isRegister ? (
              <>
                <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                  <FiMail color="#000000" size={16} />
                  <input
                    type="text"
                    placeholder="Email"
                    className="bg-[#EFF6FF] w-full outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                  <FiUser color="#000000" size={16} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#EFF6FF] w-full outline-none"
                  />
                </div>
              </>
            ) : (
              <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                <FiMail color="#000000" size={16} />
                <input
                  type="text"
                  placeholder="Email/Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#EFF6FF] w-full outline-none"
                />
              </div>
            )}
            <div
              className={
                isRegister
                  ? "bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4"
                  : "bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-1"
              }>
              <FiLock color="#000000" size={16} />
              <input
                type="password"
                placeholder="Password"
                className="bg-[#EFF6FF] w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegister ? (
              <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                <FiLock color="#000000" size={16} />
                <input
                  type="password"
                  placeholder="Repeat Password"
                  className="bg-[#EFF6FF] w-full outline-none"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
            ) : (
              <div className="text-xs text-cyan-800 font-medium select-none cursor-pointer w-fit mb-4">
                Forgot Password?
              </div>
            )}
            <div
              onClick={() => {
                isRegister
                  ? handleRegister(username, password, repeatPassword, email)
                  : handleSignIn(username, password)
              }}
              className="bg-cyan-800 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2"
              id="Login_Button">
              {isRegister ? "Register" : "Login"}
            </div>
            {isRegister ? (
              <div className="text-xs select-none w-fit mb-4 mx-auto flex gap-1">
                <div>Already have an account?</div>
                <div
                  onClick={() => {
                    setRegister(false)
                    setLogin(true)
                    setUsername("")
                    setPassword("")
                    setRepeatPassword("")
                    setEmail("")
                  }}
                  className="text-cyan-800 cursor-pointer font-medium">
                  Login in your account.
                </div>
              </div>
            ) : (
              <div className="text-xs select-none w-fit mb-4 mx-auto flex gap-1">
                <div>Don’t have an account?</div>
                <div
                  onClick={() => {
                    setLogin(false)
                    setRegister(true)
                    setUsername("")
                    setPassword("")
                  }}
                  className="text-cyan-800 cursor-pointer font-medium">
                  Create an account.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Header
