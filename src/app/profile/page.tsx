import React from 'react';
import Profile from '@/components/profile/Profile';
import Header from '@/components/main/Header';

function Profiles() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-full">
        <div className="w-full px-12 pt-12 z-0" style={{ width: `calc(100% - 300px)` }}>
          <div className='text-center'>
            <Profile />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profiles;