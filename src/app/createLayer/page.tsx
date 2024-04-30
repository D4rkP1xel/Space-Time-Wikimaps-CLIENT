import React from 'react';
import CreateLayer from '@/components/createLayer/CreateLayer';
import Header from '@/components/main/Header';

function CreateLayers() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-full">
        <div className="w-full px-12 pt-12 z-0" style={{ width: `calc(100% - 300px)` }}>
          <div className='text-center'>
            <CreateLayer />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateLayers;
