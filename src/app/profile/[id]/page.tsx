"use client"
import React, { useState } from 'react';
import Header from '@/components/main/Header';
import { useUserState } from '../../../../utils/stateManagement/user';



function Profiles({ params }: { params: { id: string } }) {

  const [isLogin, setLogin] = useState(false)
  const useUser = useUserState()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [email, setEmail] = useState("")

  const isProfileOwner = () => {
    return useUser.user?.id.toString() == params.id
  }

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="w-full px-12 pt-12 z-0" style={{ width: `calc(100% - 300px)` }}>
          <div className='text-center'>
        
      <div className="block mb-12">
        <div className="font-bold text-2xl mb-12">Profile</div>
          {/* Part of the Name */}
          <div className="row-12 flex ml-96 mb-12">
            <span className="mr-2 text-lg font-bold text-">Name:</span>
              <span className=" px-1 py-1 ">{useUser.user?.username}</span>
          </div>
          <div className="row-12 flex  ml-96 mb-12">
            <span className="mr-2 text-lg font-bold text-">Email:</span>
              <span className=" px-1 py-1 ">{useUser.user?.email}</span>
          </div>
          <div className="row-12 flex  ml-96 mb-12">
            <span className="mr-2 text-lg font-bold text-">Role:</span>
              <span className=" px-1 py-1 ">{useUser.user?.role}</span>
          </div>
          // If the user is logged in, show the following
            <div className="row-12 flex justify-center mb-12">
                <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-cyan-900'>Change Password</span>

            </div>
            <div className="row-12 flex justify-center mb-12">
                <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-red-700'> DELETE Account</span>
            </div>
      </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Profiles;