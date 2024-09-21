import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Lorley</h1>
      <p className="text-lg text-gray-600 mb-8">Your one-stop platform for discovering businesses.</p>

      <div className="flex space-x-4 mb-12">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => window.location.href='/register'}
        >
          Join Us
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => window.location.href='/business'}
        >
          Explore Businesses
        </button>
      </div>

      <section className="bg-white shadow-md p-8 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Features</h2>
        <ul className="list-disc list-inside text-left space-y-2 text-gray-600">
          <li>Find local businesses easily</li>
          <li>Read and write reviews</li>
          <li>Post events and discover what's happening around you</li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
