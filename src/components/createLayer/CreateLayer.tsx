"use client"
import React, { useState } from 'react';
import Map from '@/components/main/Map';

function CreateLayer() {
  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="block mb-12">
      <div className="font-bold text-2xl mb-12">New layer</div>
        {/* Part of the Name */}
        <div className="row-12 flex mb-12">
          <label htmlFor="name" className="mr-2 text-lg font-bold text-">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="border border-gray-400 px-2 py-1 rounded flex-grow"
          />
        </div>
        {/* Part of the Description */}
        <div className="row-12 flex mb-2">
          <label htmlFor="description" className="mr-2 text-lg font-bold">Description:</label>
        </div>
        <div className="row-12 flex justify-center items-center mb-12">
          <textarea
            id="description"
            value={name}
            onChange={handleNameChange}
            className="border border-gray-400 px-2 py-1 rounded flex-grow"
            style={{width: '100%', height: '300px'}}
          />
        </div>
        {/* Part of the SparSQL and Map */}
      <div className="row-12 flex mb-2 ">
        {/* SparSQL */}
        <div className="w-1/2 mr-4 text-left ">
          <label htmlFor="sparQL" className="text-lg font-bold mb-2">SparQL Query:</label>
        </div>
        {/* Map */}
        <div className=" w-1/2 text-center">
          <label htmlFor="map" className="text-lg font-bold mb-2">Map:</label>
        </div>
      </div>
      {/* SparSQL */}
      <div className="row-6 flex  ">
        <textarea
          id="sparSQL"
          value={name}
          onChange={handleNameChange}
          className="border border-gray-400 px-2 py-1 mb-2 rounded w-1/2 background-gray-400"
          style={{ width: '750px', height: '400px' }}
        />
      </div>  
      {/* Map */}
      <div className="row-6 flex justify-center items-center mb-12">
        {/* Map */}
      </div>

      {/* Test Query button */}
      <div className="row-12 w-1/2 justify-center flex mb-12 ">
        <button
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => alert('Layer created!')}>
          Test Query
        </button>
      </div>

      {/* Part of Query Result */}
      <div className="row-12 flex mb-2">
          <label htmlFor="result" className="mr-2 text-lg font-bold">Query Result:</label>
        </div>
        <div className="row-12 flex justify-center items-center mb-12 ">
          <textarea
            id="result"
            value={name}
            onChange={handleNameChange}
            className="border border-gray-400 px-2 py-1 rounded flex-grow"
            style={{ width: '400px', height: '400px' }}
          />
        </div>

      {/* Create Layer button */}
      <div className="row-12 flex justify-center items-center mb-12">
        <button
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => alert('Layer created!')}>
          Create Layer
        </button>
      </div>
    </div>
  );
}

export default CreateLayer;