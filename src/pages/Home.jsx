import React from 'react';
import { FiPhone } from 'react-icons/fi'
import ChatBot from '../chatbot/ChatBot';

const Home = () => {
  return (
    <div className="bg-green-50 h-[90vh] flex flex-col items-center justify-center relative">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Tied & Tested Badge */}
          <div className="inline-block bg-white rounded-full px-4 py-2 mb-6 shadow-md">
            <div className="flex items-center space-x-2">
              {/* Use actual images */}
              <img src="/person-01.jpg" alt="Person 1" className="w-6 h-6 rounded-full object-cover" />
              <img src="/person-02.jpg" alt="Person 2" className="w-6 h-6 rounded-full object-cover" />
              <img src="/person-03.jpg" alt="Person 3" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-gray-700 text-sm font-medium">Tied & Tested</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Creating a World Where Mental Health is Valued
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:px-10 lg:px-20">
            You're Not Alone — We're Always Here to Listen, Support, and Walk With You.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* Using the custom Button component might be better here */} 
            <button className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              GET STARTED
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 border border-gray-900 px-3.5 py-2.5 rounded-md hover:bg-gray-100 transition">
            <FiPhone className="text-lg" />
              CALL NOW
            </button>
          </div>
        </div>
      </div>
      
      {/* Fixed ChatBot Component */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBot />
      </div>
    </div>
  );
};

export default Home; 

// Add this to your Home.jsx file
