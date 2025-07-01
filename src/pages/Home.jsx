import React, { useEffect } from 'react';
import { FiPhone, FiHeart, FiShield, FiTrendingUp } from 'react-icons/fi';
import ChatBot from '../chatbot/ChatBot';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import aboutimg from ''

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const features = [
    {
      icon: <FiHeart className="w-8 h-8 text-green-600" />,
      title: "Compassionate Listening",
      description: "A supportive space to express your feelings without judgment, with AI that truly understands.",
      bgColor: "bg-white",
      iconBg: "bg-green-100"
    },
    {
      icon: <FiShield className="w-8 h-8 text-green-600" />,
      title: "Emotional Support",
      description: "Personalized guidance to help you navigate challenging emotions and difficult situations.",
      bgColor: "bg-white",
      iconBg: "bg-green-100"
    },
    {
      icon: <FiTrendingUp className="w-8 h-8 text-green-400" />,
      title: "Personal Growth",
      description: "Evidence-based insights to foster self-awareness and sustainable emotional well-being.",
      bgColor: "bg-white",
      iconBg: "bg-green-100"
    }
  ];

  return (
    <div className="bg-green-50 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-40 sm:h-64 bg-gradient-to-b from-green-100/80 to-transparent rounded-b-3xl blur-2xl" />
      </div>
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-14 sm:mb-20 flex flex-col items-center px-2 sm:px-0">
          {/* Tied & Tested Badge */}
          <div className="inline-block bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-10 shadow-lg border border-green-100 animate-fade-in">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <img src="/person-01.jpg" alt="Person 1" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-green-200" />
              <img src="/person-02.jpg" alt="Person 2" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-green-200" />
              <img src="/person-03.jpg" alt="Person 3" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-green-200" />
              <span className="text-gray-700 text-sm sm:text-base font-medium ml-1 sm:ml-2">Tried & Tested</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 max-w-xs xs:max-w-md sm:max-w-4xl mx-auto leading-tight mb-3 sm:mb-5 animate-fade-in-up">
            Unlocking Mental Well-being with the Power of AI
          </h1>

          {/* Subtitle */}
          <p className="mt-2 sm:mt-4 text-base xs:text-lg sm:text-xl text-gray-600 max-w-xs xs:max-w-md sm:max-w-2xl mx-auto mb-6 sm:mb-10 animate-fade-in-up delay-100">
            You're Not Alone — We're Always Here to Listen, Support, and Walk With You.
          </p>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto animate-fade-in-up delay-200">
            <button className="rounded-3xl bg-green-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 w-full sm:w-auto transition-all duration-200">
              GET STARTED
            </button>
            <button className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-green-700 border border-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-3xl hover:bg-green-100 transition-all w-full sm:w-auto">
              <FiPhone className="text-base sm:text-lg" />
              CALL NOW
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-6 sm:mt-10 mb-10 sm:mb-20">
          <div className="md:grid md:grid-cols-3 md:gap-8 lg:gap-12 md:max-w-5xl md:mx-auto">
            {/* Mobile horizontal scroll */}
            <div className="flex overflow-x-auto gap-3 sm:gap-4 px-1 sm:px-2 pb-3 sm:pb-4 snap-x snap-mandatory md:hidden">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`${feature.bgColor} rounded-2xl p-4 sm:p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 flex-shrink-0 w-60 xs:w-72 snap-center border border-green-100 scale-100 hover:scale-105`}
                >
                  <div className={`${feature.iconBg} w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Desktop grid */}
            <div className="hidden md:contents">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`${feature.bgColor} rounded-2xl p-6 lg:p-8 text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-green-100 animate-fade-in-up`}
                >
                  <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3 lg:mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="about max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-4xl mx-auto my-10 sm:my-24 px-2 xs:px-4 sm:px-8 py-6 sm:py-12 bg-white/80 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-10 border border-green-100">
          {/* Text Content */}
          <div className="flex-1 text-left w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-700 mb-2 sm:mb-3 relative inline-block">
              About TruCare
              <span className="block h-1 w-10 sm:w-16 bg-green-200 rounded-full mt-1 sm:mt-2"></span>
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
              TruCare is an AI-powered mental health platform designed to provide anonymous, accessible, and affordable psychological support.
            </p>
            <div>
              <h3 className="text-green-700 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Our mission:</h3>
              <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                <li><span className="font-semibold text-green-700">Stigma-free support:</span> A mental health ecosystem where support is available anytime, anywhere.</li>
                <li><span className="font-semibold text-green-700">Scalable & accessible:</span> AI-based approach, bilingual accessibility, and affordable therapy options.</li>
                <li><span className="font-semibold text-green-700">Bridging the gap:</span> Connecting those in need with quality mental health care.</li>
              </ul>
            </div>
          </div>
          {/* Image */}
          <div className="flex-1 flex justify-center items-center w-full md:w-auto">
            <img
              src="/home.jpg"
              alt="About TruCare"
              className="w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-full shadow-md border-4 border-green-100 bg-green-50"
            />
          </div>
        </section>

        {/* Reviews / Blogs Section */}
        <div className="bg-green-50 py-8 sm:py-14 px-1 xs:px-2 sm:px-8 lg:px-16 rounded-3xl max-w-xs xs:max-w-2xl sm:max-w-4xl lg:max-w-6xl mx-auto mb-6 sm:mb-10 animate-fade-in-up">
          <div className="max-w-xs xs:max-w-2xl sm:max-w-4xl lg:max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-6 sm:mb-10">
              What People Are Saying
            </h2>
            {/* Responsive Card Grid or Carousel */}
            <div className="flex flex-col gap-4 sm:hidden overflow-x-auto pb-2 snap-x snap-mandatory">
              {/* Mobile: horizontal scroll for reviews */}
              <div className="flex gap-4">
                {/* Review 1 */}
                <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl transition border border-green-100 animate-fade-in-up min-w-[85vw] max-w-[90vw] snap-center">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    "TruCare helped me through a really dark phase. The AI felt human and comforting. I felt heard and supported."
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <img src="/person-01.jpg" alt="Aarav" className="w-8 h-8 rounded-full object-cover border-2 border-green-200 shadow" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">Aarav M.</h4>
                      <p className="text-[10px] text-gray-500">Delhi, India</p>
                    </div>
                  </div>
                </div>
                {/* Review 2 */}
                <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl transition border border-green-100 animate-fade-in-up delay-100 min-w-[85vw] max-w-[90vw] snap-center">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    "The support felt so personal, even though it was AI. It's affordable, easy to use, and surprisingly effective!"
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <img src="/person-02.jpg" alt="Ishita" className="w-8 h-8 rounded-full object-cover border-2 border-green-200 shadow" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">Ishita R.</h4>
                      <p className="text-[10px] text-gray-500">Mumbai, India</p>
                    </div>
                  </div>
                </div>
                {/* Review 3 */}
                <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl transition border border-green-100 animate-fade-in-up delay-200 min-w-[85vw] max-w-[90vw] snap-center">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    "As someone hesitant to seek help, TruCare broke that barrier. The chatbot felt like a friend I could always talk to."
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <img src="/person-03.jpg" alt="Riya" className="w-8 h-8 rounded-full object-cover border-2 border-green-200 shadow" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">Riya S.</h4>
                      <p className="text-[10px] text-gray-500">Bangalore, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Desktop grid */}
            <div className="hidden sm:grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Review 1 */}
              <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl transition border border-green-100 animate-fade-in-up">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  "TruCare helped me through a really dark phase. The AI felt human and comforting. I felt heard and supported."
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src="/person-01.jpg" alt="Aarav" className="w-10 h-10 rounded-full object-cover border-2 border-green-200 shadow" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Aarav M.</h4>
                    <p className="text-xs text-gray-500">Delhi, India</p>
                  </div>
                </div>
              </div>
              {/* Review 2 */}
              <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl transition border border-green-100 animate-fade-in-up delay-100">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  "The support felt so personal, even though it was AI. It's affordable, easy to use, and surprisingly effective!"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src="/person-02.jpg" alt="Ishita" className="w-10 h-10 rounded-full object-cover border-2 border-green-200 shadow" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Ishita R.</h4>
                    <p className="text-xs text-gray-500">Mumbai, India</p>
                  </div>
                </div>
              </div>
              {/* Review 3 */}
              <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl transition border border-green-100 animate-fade-in-up delay-200">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  "As someone hesitant to seek help, TruCare broke that barrier. The chatbot felt like a friend I could always talk to."
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src="/person-03.jpg" alt="Riya" className="w-10 h-10 rounded-full object-cover border-2 border-green-200 shadow" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Riya S.</h4>
                    <p className="text-xs text-gray-500">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>
            {/* For mobile, you can later add a carousel/slider for reviews if desired */}
          </div>
        </div>
      </div>

      {/* Floating ChatBot Button (Mobile) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-fade-in-up">
        <ChatBot />
      </div>

      {/* Decorative Robot Illustration (optional, hidden for now) */}
      {/* <div className="absolute bottom-0 right-0 hidden md:block w-48 h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 -mb-10 -mr-10">
        <img src="/robot.png" alt="AI Robot" className="w-full h-full object-contain" />
      </div> */}

      {/* Animations (TailwindCSS custom classes, add to your global CSS if not present) */}
      {/*
      .animate-fade-in { animation: fadeIn 0.8s ease both; }
      .animate-fade-in-up { animation: fadeInUp 0.8s ease both; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      */}
    </div>
  );
};

export default Home;