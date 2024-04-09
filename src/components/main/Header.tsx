"use client"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { FaSignInAlt } from "react-icons/fa"
import { FaUserPlus } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { FiMail } from "react-icons/fi"
import { FiLock } from "react-icons/fi"

function Header() {
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [isLogin, setLogin] = useState(false)
  const [isRegister, setRegister] = useState(false)

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

  return (
    <>
      <div className="h-20 bg-cyan-700 w-full flex items-center px-8">
        <div className="font-extrabold text-2xl text-white mr-8">WIKIMAPS</div>
        <div className="flex gap-4 bg-cyan-900 items-center py-2 pl-4 pr-1 rounded-full">
          <FaSearch color="#FFFFFF" size={16} />
          <input
            type="text"
            className="bg-cyan-900 w-80 text-white border-none outline-none"
          />
        </div>
        <div
          className="ml-auto p-2 cursor-pointer"
          onClick={() => setMenuOpened(!isMenuOpened)}>
          <FaUser color="#FFFFFF" size={24} />
        </div>
        <div className={isMenuOpened ? "relative" : "hidden"}>
          <div className="absolute bg-slate-50 shadow-md shadow-[#828282] rounded-md w-60 right-8 top-3 py-4 px-3 z-50">
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
          </div>
        </div>
      </div>
      {isRegister === true || isLogin === true ? (
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() =>
              isRegister ? setRegisterState(false) : setLoginState(false)
            }>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
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
                  />
                </div>
                <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                  <FaUser color="#000000" size={16} />
                  <input
                    type="text"
                    placeholder="Username"
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
              />
            </div>
            {isRegister ? (
              <div className="bg-[#EFF6FF] rounded-full flex items-center gap-2 py-2 px-2 mb-4">
                <FiLock color="#000000" size={16} />
                <input
                  type="password"
                  placeholder="Repeat Password"
                  className="bg-[#EFF6FF] w-full outline-none"
                />
              </div>
            ) : (
              <div className="text-xs text-cyan-800 font-medium select-none cursor-pointer w-fit mb-4">
                Forgot Password?
              </div>
            )}

            <div className="bg-cyan-800 text-white text-center rounded-full py-2 w-1/2 mx-auto font-medium text-lg select-none cursor-pointer mb-2">
              Login
            </div>
            {isRegister ? (
              <div className="text-xs select-none w-fit mb-4 mx-auto flex gap-1">
                <div>Already have an account?</div>
                <div className="text-cyan-800 cursor-pointer font-medium">
                  Login in your account.
                </div>
              </div>
            ) : (
              <div className="text-xs select-none w-fit mb-4 mx-auto flex gap-1">
                <div>Don’t have an account?</div>
                <div className="text-cyan-800 cursor-pointer font-medium">
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
