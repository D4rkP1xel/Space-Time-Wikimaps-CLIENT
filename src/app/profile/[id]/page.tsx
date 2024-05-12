"use client"
import React, { use, useState } from 'react';
import Header from '@/components/main/Header';
import { changePasswordUser, getUserByID, useUserState } from '../../../../utils/stateManagement/user';
import { FaUser, FaUserEdit, FaUserShield } from 'react-icons/fa';
import { useQuery } from 'react-query';
import PageCircleLoader from '@/components/loaders/PageCircleLoader';
import { useCheckAuth } from '../../../../utils/customHooks/checkAuth';
import { useRouter } from 'next/navigation';
import { FiLock, FiX } from 'react-icons/fi';



function Profiles({ params }: { params: { id: string } }) {

  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN", "EDITOR", "USER"])
  const [isChangingPassword, setChangePassword] = useState(false)
  const useUser = useUserState()
  const [username, setUsername] = useState("")
  const [password, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [email, setEmail] = useState("")
  function setChangePasswordState(state: boolean) {
    setChangePassword(state)
  }
  

  const isProfileOwner = () => {
    return useUser.user?.id.toString() == params.id
  }

  async function ChangePassword(oldPasswordParam: string, newPasswordParam: string) {
    try {
      if (useUser.user == null) return
      await changePasswordUser(useUser.user?.id.toString() ,oldPasswordParam, newPasswordParam)
      setOldPassword("")
      setNewPassword("")
    } catch (error) {
      // console.error(error)
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
          <div className="w-full px-12 pt-12 z-0" style={{ width: `calc(100% - 300px)` }}>
            <div className='text-center'>
              <div className="block mb-12">
                <div className="font-bold text-2xl mb-12">Profile</div>
                  <div className="row-12 flex ml-96 mb-12">
                    <span className="mr-2 text-lg font-bold text-">Name:</span>
                      <span className=" px-1 py-1 ">{isProfileOwner() ? useUser.user?.username : isLoadingUser ? null : user?.username}</span>
                  </div>
                  <div className="row-12 flex  ml-96 mb-12">
                    <span className="mr-2 text-lg font-bold text-">Email:</span>
                      <span className=" px-1 py-1 ">{isProfileOwner() ? useUser.user?.email : isLoadingUser ? null : user?.email}</span>
                  </div>
                  <div className="row-12 flex  ml-96 mb-12">
                    <span className="mr-2 text-lg font-bold text-">Role:</span>
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
                  {isProfileOwner() ? (
                    <div className="row-12 flex justify-center mb-12">
                      <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-cyan-900'  onClick={() => setChangePasswordState(true)}>Change Password</span>
                    </div>
                  ) : null}
                    {isProfileOwner() || (useUser.user?.role == "ADMIN" && !(user?.role == "ADMIN")) ? (
                    <div className="row-12 flex justify-center mb-12">
                        <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-red-700'> DELETE Account</span>
                    </div>
                    ) : null}
                </div>
              </div>
            </div>
          </div>


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
      </>
    );
  }
}

export default Profiles;