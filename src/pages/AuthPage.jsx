import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function AuthPage() {
  const [method, setMethod] = useState('phone'); // 'phone', 'google'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [error, setError] = useState(null);
  const [confirmationResultObj, setConfirmationResultObj] = useState(null); // State to store confirmationResult object

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // If user is already logged in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);


  useEffect(() => {
    if (method === 'phone' && !recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
        verifier.render();
        setRecaptchaVerifier(verifier);
      } catch (err) {
        console.error("Recaptcha error: ", err);
        setError("Failed to load ReCAPTCHA. Please try again.");
      }
    }
    // Cleanup function if needed
    return () => {
      // if (recaptchaVerifier) {
      //   recaptchaVerifier.clear();
      // }
    };
  }, [method, recaptchaVerifier, auth]); // Added auth to dependency array


  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!recaptchaVerifier) {
        setError("ReCAPTCHA not loaded. Please try again.");
        return;
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResultObj(confirmationResult); // Store the confirmationResult object
      setVerificationId(confirmationResult.verificationId); // Keep verificationId for UI logic
      console.log('OTP sent!');
      // Prompt user for OTP
    } catch (error) {
      setError(error.message);
      console.error('Phone auth error:', error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (confirmationResultObj) {
        await confirmationResultObj.confirm(otp);
        console.log('Phone number verified!');
        // Redirect or update UI on successful login/signup
        navigate('/dashboard');
      } else {
        setError("Please send OTP first.");
      }
    } catch (error) {
      setError(error.message);
      console.error('OTP verification error:', error);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('User signed in with Google!');
      // Redirect or update UI on successful login/signup
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Google auth error:', error);
    }
  };

  // If currentUser exists, don't render the auth page to prevent flickering before redirect
  if (currentUser) {
      return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In or Sign Up
          </h2>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Phone verification is currently under development. Please use Google sign-in for now.
        </p>

        {/* Method Switcher - Keep only Phone and maybe Email/Password if re-added */}
        <div className="flex justify-center space-x-4 mb-6">
           <button
            onClick={() => setMethod('phone')}
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              method === 'phone' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Phone
          </button>
           {/* Email/Password button removed */}
        </div>

        {method === 'phone' && (
          <form onSubmit={verificationId ? handleVerifyOtp : handlePhoneAuth} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="phone-number" className="sr-only">Phone Number</label>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number (e.g., +91 934567890)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!!verificationId}
                />
              </div>
              {verificationId && (
                <div>
                  <label htmlFor="otp" className="sr-only">OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-3/4 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}
            </div>

            {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {verificationId ? 'Verify OTP' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Google Sign-in Button - Always visible */}
        <div className="mt-6">
           <button
              onClick={handleGoogleAuth}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
           >
              Sign in with Google
           </button>
        </div>

         <div id="recaptcha-container"></div> {/* ReCAPTCHA container */}

      </div>
    </div>
  );
}

export default AuthPage; 