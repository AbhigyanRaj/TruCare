import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you might add links later
import { MdAssessment, MdBookOnline, MdChat, MdCall, MdPerson, MdAssignment } from 'react-icons/md'; // Example icons

// Note: If you don't have react-icons installed, run: npm install react-icons

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Welcome to Your Dashboard</h1>
        <p className="text-lg text-gray-600 mb-10">Explore the tools and resources available to support your well-being.</p>

        {/* Feature Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Intro level Assessment Test */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition duration-300 ease-in-out flex flex-col">
            <div className="p-8 flex-grow">
               <div className="flex items-center mb-4">
                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                   <MdAssessment className="h-6 w-6 text-green-600" aria-hidden="true" />
                 </div>
                 <h2 className="ml-4 text-xl font-semibold text-gray-900">Assessment Test</h2>
               </div>
              <p className="text-gray-600 mt-2">Start with an introductory assessment to understand your current state and get personalized insights.</p>
            </div>
             <div className="p-8 bg-gray-50">
               <Link to="/dashboard/assessment" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                 Take Test
               </Link>
             </div>
          </div>

          {/* Book Counsellor */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition duration-300 ease-in-out flex flex-col">
            <div className="p-8 flex-grow">
              <div className="flex items-center mb-4">
                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                   <MdBookOnline className="h-6 w-6 text-green-600" aria-hidden="true" />
                 </div>
                 <h2 className="ml-4 text-xl font-semibold text-gray-900">Book a Counsellor</h2>
               </div>
              <p className="text-gray-600 mt-2">Find and book sessions with professional counsellors based on their availability and your needs.</p>
            </div>
             <div className="p-8 bg-gray-50">
              <Link to="/dashboard/counsellors" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Book Now
              </Link>
             </div>
          </div>

          {/* Chat Option (Bot API linked) */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition duration-300 ease-in-out flex flex-col">
             <div className="p-8 flex-grow">
               <div className="flex items-center mb-4">
                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                   <MdChat className="h-6 w-6 text-green-600" aria-hidden="true" />
                 </div>
                 <h2 className="ml-4 text-xl font-semibold text-gray-900">Chat Support</h2>
               </div>
              <p className="text-gray-600 mt-2">Get instant support through our AI chat bot or connect with a counsellor via text.</p>
             </div>
             <div className="p-8 bg-gray-50">
              <Link to="/dashboard/chat" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Start Chat
              </Link>
             </div>
          </div>

          {/* Voice Call Option */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition duration-300 ease-in-out flex flex-col">
            <div className="p-8 flex-grow">
               <div className="flex items-center mb-4">
                 <div className="flex-shrink-0 bg-gray-200 rounded-md p-3">
                   <MdCall className="h-6 w-6 text-gray-600" aria-hidden="true" />
                 </div>
                 <h2 className="ml-4 text-xl font-semibold text-gray-900">Voice Call Support</h2>
               </div>
              <p className="text-gray-600 mt-2">Connect with a counsellor for a voice conversation when you need to talk.</p>
            </div>
            <div className="p-8 bg-gray-50">
              <button className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-500 bg-gray-300 cursor-not-allowed">Call Now (Coming Soon)</button>
            </div>
          </div>

          {/* In Person Meet Option */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition duration-300 ease-in-out flex flex-col">
            <div className="p-8 flex-grow">
              <div className="flex items-center mb-4">
                 <div className="flex-shrink-0 bg-gray-200 rounded-md p-3">
                   <MdPerson className="h-6 w-6 text-gray-600" aria-hidden="true" />
                 </div>
                 <h2 className="ml-4 text-xl font-semibold text-gray-900">In-Person Meetings</h2>
               </div>
              <p className="text-gray-600 mt-2">Schedule a face-to-face meeting with a counsellor in your area.</p>
            </div>
            <div className="p-8 bg-gray-50">
              <button className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-500 bg-gray-300 cursor-not-allowed">Meet In Person (Coming Soon)</button>
            </div>
          </div>

          {/* Test yourself/Depression/Anxiety and other multiple things tests */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition duration-300 ease-in-out flex flex-col">
             <div className="p-8 flex-grow">
               <div className="flex items-center mb-4">
                 <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                   <MdAssignment className="h-6 w-6 text-green-600" aria-hidden="true" />
                 </div>
                 <h2 className="ml-4 text-xl font-semibold text-gray-900">Self-Assessment Tests</h2>
               </div>
              <p className="text-gray-600 mt-2">Access a variety of self-assessment tests to help you understand and track your mental well-being.</p>
             </div>
             <div className="p-8 bg-gray-50">
              <Link to="/dashboard/tests" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                View Tests
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;