"use client"
import React, { useState } from 'react';
import Header from '@/components/main/Header';
import { getUserByID, useUserState } from '../../../../utils/stateManagement/user';
import { FaUser, FaUserEdit, FaUserShield } from 'react-icons/fa';
import { useQuery } from 'react-query';
import PageCircleLoader from '@/components/loaders/PageCircleLoader';
import { useCheckAuth } from '../../../../utils/customHooks/checkAuth';
import { useRouter } from 'next/navigation';



function Profiles({ params }: { params: { id: string } }) {

  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN", "EDITOR", "USER"])
  const [isLogin, setLogin] = useState(false)
  const useUser = useUserState()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [email, setEmail] = useState("")
  

  const isProfileOwner = () => {
    return useUser.user?.id.toString() == params.id
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
                      <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-cyan-900'>Change Password</span>
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
      </>
    );
  }
}

export default Profiles;