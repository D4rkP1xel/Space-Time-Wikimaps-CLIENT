"use client"
import React, { useState } from 'react';

function Profile() {

  return (
    <div className="block mb-12">
      <div className="font-bold text-2xl mb-12">Profile</div>
        {/* Part of the Name */}
        <div className="row-12 flex ml-96 mb-12">
          <span className="mr-2 text-lg font-bold text-">Name:</span>
            <span className=" px-1 py-1 ">John Doe</span>
        </div>
        <div className="row-12 flex  ml-96 mb-12">
          <span className="mr-2 text-lg font-bold text-">Email:</span>
            <span className=" px-1 py-1 ">email</span>
        </div>
        <div className="row-12 flex  ml-96 mb-12">
          <span className="mr-2 text-lg font-bold text-">Role:</span>
            <span className=" px-1 py-1 ">Pedreiro</span>
        </div>

        <div className="row-12 flex justify-center mb-12">
            <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-cyan-900'>Change Password</span>

        </div>
        <div className="row-12 flex justify-center mb-12">
            <span className='text-lg font-bold border px-12 py-2 text-white rounded-full bg-red-700'> DELETE Account</span>
        </div>
    </div>
  );
}

export default Profile;