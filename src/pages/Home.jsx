import React, { useEffect } from 'react';
import { FiPhone } from 'react-icons/fi'
import ChatBot from '../chatbot/ChatBot';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-green-50 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-24">
          {/* Tied & Tested Badge */}
          <div className="inline-block bg-white rounded-full px-5 py-2.5 mb-12 shadow-lg">
            <div className="flex items-center space-x-2">
              {/* Use actual images */}
              <img src="/person-01.jpg" alt="Person 1" className="w-6 h-6 rounded-full object-cover" />
              <img src="/person-02.jpg" alt="Person 2" className="w-6 h-6 rounded-full object-cover" />
              <img src="/person-03.jpg" alt="Person 3" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-gray-700 text-sm font-medium">Tied & Tested</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight mb-4">
            Unlocking Mental Well-being with the Power of AI
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:px-10 lg:px-20 max-w-3xl mx-auto mb-8">
            You're Not Alone — We're Always Here to Listen, Support, and Walk With You.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-y-4 sm:gap-x-6">
            {/* Using the custom Button component might be better here */} 
            <button className="rounded-3xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 w-full sm:w-auto sm:px-6 sm:py-3.5 sm:text-base">
              GET STARTED
            </button>
            <button className="flex items-center justify-center gap-2 text-sm font-semibold leading-6 text-gray-900 border border-gray-900 px-4 py-2.5 rounded-3xl hover:bg-gray-100 transition w-full sm:w-auto sm:px-6 sm:py-3.5 sm:text-base">
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
      {/* Robot Illustration */}
      <div className="absolute bottom-0 right-0 hidden md:block w-48 h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 -mb-10 -mr-10">
        {/* <img src="/robot.png" alt="AI Robot" className="w-full h-full object-contain" /> */}
      </div>
    </div>
  );
};

export default Home; 

// Add this to your Home.jsx file
