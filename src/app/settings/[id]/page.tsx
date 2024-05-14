"use client"
import React, { use, useState } from 'react';
import Header from '@/components/main/Header';
import { askToBeEditorUser, changePasswordUser, getUserByID, useUserState } from '../../../../utils/stateManagement/user';
import { FaUser, FaUserEdit, FaUserShield } from 'react-icons/fa';
import { useQuery } from 'react-query';
import PageCircleLoader from '@/components/loaders/PageCircleLoader';
import { useCheckAuth } from '../../../../utils/customHooks/checkAuth';
import { useRouter } from 'next/navigation';
import { FiLock, FiX } from 'react-icons/fi';
import DarkBlueButton from '@/components/buttons/DarkBlueButton';
import DeclineButton from '@/components/buttons/DeclineButton';



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

  function setChangePasswordState(state: boolean) {
    setChangePassword(state)
  }
  function askToBeEditor(state: boolean) {
    setAskToBeEditor(state)
  }
  

  const isProfileOwner = () => {
    return useUser.user?.id.toString() == params.id
  }

  async function ChangePassword(oldPasswordParam: string, newPasswordParam: string) {
    try {
      if (useUser.user == null || newPasswordParam.length < 6) return
      await changePasswordUser(useUser.user?.id.toString() ,oldPasswordParam, newPasswordParam)
      setOldPassword("")
      setNewPassword("")
    } catch (error) {
      // console.error(error)
    }
  }

  async function AskToBeEditor(message: string) {
    try {
      if (useUser.user == null) return
      await askToBeEditorUser(message)
      setMessage("")
    } catch (error) {
       console.error(error)
    }
  }

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery(
    ["user"],
    async () => {
      return await getUserByID(params.id)
    },
    { enabled: !checkAuth.isRenderLoader() == false && !isProfileOwner() }
  )
  if (checkAuth.isRenderLoader()) {
    return <PageCircleLoader />
  } else {
    
    return (
      <>
        <div className="flex justify-center items-center h-full">
          <div className="w-full px-12 pt-12 z-0" >
            <div className='text-center'>
              <div className="block mb-12">
                <div className="font-bold text-4xl mb-12">Settings</div>
                  <div className="flex flex-row justify-center mb-12">
                    <div className="flex flex-row">
                      <span className=" text-lg font-bold text ">Name:</span>
                        <input disabled={!isProfileOwner()}
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="border border-gray-400 px-2 py-1 rounded w-100 "
                          placeholder={isProfileOwner() ? useUser.user?.username : isLoadingUser ? "" : user?.username}
                        />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center mb-12">
                    <div className="flex flex-row ">
                      <span className=" text-lg font-bold text-">Email:</span>
                      <input disabled={!isProfileOwner()}
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border border-gray-400 px-2 py-1 rounded w-100"
                          placeholder={isProfileOwner() ? useUser.user?.email : isLoadingUser ? "" : user?.email}
                        />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center mb-6">
                    <div className="flex flex-row">
                      <span className=" text-lg font-bold text-">Role:</span>
                        <span className=" px-1 py-1 ">{isProfileOwner() ? useUser.user?.role : isLoadingUser ? null : user?.role}</span>
                      <div className="p-2">
                        {isProfileOwner() && useUser.user?.role ?
                        useUser.user.role == "ADMIN" ? 
                        <FaUserShield color="#000000" size={24} />
                          : useUser.user.role == "EDITOR" ?
                          <FaUserEdit color="#000000" size={24} />
                            : <FaUser color="#000000" size={24} />
                        : user?.role == "ADMIN" ? 
                        <FaUserShield color="#000000" size={24} />
                          : user?.role == "EDITOR" ?
                          <FaUserEdit color="#000000" size={24} />
                            : <FaUser color="#000000" size={24} />}
                      </div>
                    </div>
                  </div>
                    {isProfileOwner() ? (
                      <>
                      <div className="flex flex-row justify-center mb-12">
                        <div className="flex flex-row"> 
                          <DarkBlueButton logoComponent={null} buttonText="Save"  onClick={() => ("")}/>
                        </div> 
                      </div>
                      </>
                    ) : null}	
                  {isProfileOwner() ? (     
                    <>              
                    <div className="flex flex-row gap-20 justify-center mb-12">
                      <div className="flex flex-col ">
                          <div className="text-lg font-bold">Password Settings:</div>     
                          <DarkBlueButton logoComponent={null} buttonText="Change Password"  onClick={() => setChangePasswordState(true)} />
                      </div>
                          {isProfileOwner() && !(user?.role == "ADMIN" || useUser.user?.role =="ADMIN" )? (
                            <>
                            <div className="flex flex-col">
                              <div className="text-lg font-bold">Editor Settings:</div>         
                              <DarkBlueButton logoComponent={null} buttonText="Ask To Be an Editor" onClick={() => askToBeEditor(true)} />
                            </div>
                            </>
                          ) : null}
                    </div>
                    </> 
                  ) : null}
                    
                  {isProfileOwner() || (useUser.user?.role == "ADMIN" && !(user?.role == "ADMIN")) ? (
                    <div className="flex justify-center">
                      <DeclineButton logoComponent={null} buttonText="Delete Account" onClick={() => {}} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Modal */}
          {isChangingPassword === true ?(
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
            <div className="text-2xl font-medium mx-auto mb-6">Change Password</div>
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
            ): null}
          {/* End of Password Modal*/}

          {/* Ask To Be Editor Modal */}
          {isAskingToBeEditor === true ?(
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() => {
              setAskToBeEditor(false) 
              setMessage("")
            }}>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white shadow-lg shadow-[#828282] w-4/12 p-8 mx-auto my-auto flex flex-col">
            
            <div className="text-2xl font-medium mx-auto mb-6">Ask To Be An Editor</div>
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
            ): null}
          {/* End of Ask to be Editor Modal*/}
      </>
    );
  }
}

export default Settings;