"use client"
import React, { use, useState } from 'react';
import {getUserByID, useUserState } from '../../../../utils/stateManagement/user';
import { FaUser, FaUserEdit, FaUserShield } from 'react-icons/fa';
import { useQuery } from 'react-query';
import PageCircleLoader from '@/components/loaders/PageCircleLoader';
import { useCheckAuth } from '../../../../utils/customHooks/checkAuth';
import { useRouter } from 'next/navigation';
import { FiLock, FiX } from 'react-icons/fi';
import DarkBlueButton from '@/components/buttons/DarkBlueButton';
import DeclineButton from '@/components/buttons/DeclineButton';
import Dashboard from '@/app/dashboard/page';
import DashboardResult from '@/components/dashboard/DashboardResult';
import { Layer, getAllLayersByUserId } from '../../../../utils/stateManagement/layers';
import ProfileLayersResult from '@/components/profile/ProfileLayersResult';



function Profile({ params }: { params: { id: string } }) {

  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN", "EDITOR", "USER"])
  const useUser = useUserState()

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

  const {
    data: layers,
    isLoading: isLoadingLayers,
    refetch: refetchLayers,
  } = useQuery(
    ["profileLayers"],
    async () => {
      return await getAllLayersByUserId(params.id)
    },
    { enabled: checkAuth.isRenderLoader() == false }
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
                <div className="font-bold text-4xl mb-12">Profile</div>
                  <div className="flex flex-row justify-center mb-12">
                    <div className="flex flex-row">
                      <span className=" text-lg font-bold text ">Name:</span>
                      <span className=" text-lg font-bold text ">{isProfileOwner() ? useUser.user?.username : isLoadingUser ? "" : user?.username}</span>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center mb-12">
                    <div className="flex flex-row ">
                      <span className=" text-lg font-bold text-">Email:</span>
                      <span className=" text-lg font-bold text-">{isProfileOwner() ? useUser.user?.email : isLoadingUser ? "" : user?.email}</span>
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
                  <div className="flex flex-row mb-12">
                    <span className=" text-lg font-bold text ">{isProfileOwner() ? useUser.user?.username : isLoadingUser ? "" : user?.username} Layers:</span>
                  </div>
                  <div className="flex flex-row justify-center mb-12">
                    <div className="flex flex-col mt-8">
                      {isLoadingLayers ? (
                        <PageCircleLoader />
                      ) : layers == null || layers.length == 0 ? (
                        "No Layers found"
                      ) : (
                        layers.map((l: Layer) => (
                          <ProfileLayersResult key={l.id} name={l.layerName} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>         
      </>
    );
  }
}

export default Profile;