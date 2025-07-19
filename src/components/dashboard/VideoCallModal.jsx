import React, { useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';

const VideoCallModal = ({ open, onClose, patientName, doctorName }) => {
  const localVideoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Start camera preview (mockup)
  const handleStartCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraOn(true);
      } catch (err) {
        alert('Could not access camera.');
      }
    }
  };

  // Stop camera preview (mockup)
  const handleEndCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    setCameraOn(false);
    onClose();
  };

  // Toggle mic/video (UI only)
  const handleToggleMic = () => setMicOn(m => !m);
  const handleToggleVideo = () => setVideoOn(v => !v);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 animate-fadeIn">
      <div className="w-full h-full max-w-full max-h-full flex flex-col items-center justify-center">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-dark-900/40 backdrop-blur-[8px]" />
        {/* Video area */}
        <div className="relative w-full max-w-3xl h-[60vh] md:h-[70vh] flex items-center justify-center rounded-3xl shadow-2xl overflow-hidden bg-white/10">
          {/* Local Video */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={`w-full h-full object-cover transition-all duration-300 ${videoOn && cameraOn ? '' : 'opacity-30 grayscale'}`}
            style={{ background: '#233a44' }}
          />
          {/* Overlay for camera preview */}
          {!cameraOn && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold bg-dark-900/40">Camera Preview</span>
          )}
          {/* Floating header (names/avatars) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg shadow">
                {patientName ? patientName[0] : 'Y'}
              </div>
              <span className="text-primary-900 font-medium text-base drop-shadow">{patientName || 'You'}</span>
            </div>
            <span className="mx-2 text-primary-300 font-bold text-xl">|</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-tertiary-400 flex items-center justify-center text-tertiary-900 font-bold text-lg shadow">
                {doctorName ? doctorName[0] : 'D'}
              </div>
              <span className="text-tertiary-900 font-medium text-base drop-shadow">{doctorName || 'Doctor'}</span>
            </div>
          </div>
          {/* Floating controls (centered bottom) */}
          <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex gap-8 z-10">
            {!cameraOn ? (
              <button
                onClick={handleStartCamera}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition bg-primary-600 hover:bg-primary-700 text-white text-2xl"
                title="Start Camera"
                aria-label="Start Camera"
              >
                <FaVideo />
              </button>
            ) : <>
              <button
                onClick={handleToggleMic}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition bg-white/80 hover:bg-primary-100 text-2xl border-2 border-primary-200 ${micOn ? '' : 'ring-2 ring-red-500'}`}
                title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                aria-label={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micOn ? <FaMicrophone className="text-primary-700" /> : <FaMicrophoneSlash className="text-red-600" />}
              </button>
              <button
                onClick={handleToggleVideo}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition bg-white/80 hover:bg-primary-100 text-2xl border-2 border-primary-200 ${videoOn ? '' : 'ring-2 ring-yellow-400'}`}
                title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                aria-label={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {videoOn ? <FaVideo className="text-primary-700" /> : <FaVideoSlash className="text-yellow-500" />}
              </button>
              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition bg-red-600 hover:bg-red-700 text-white text-2xl border-2 border-red-700"
                title="End Call"
                aria-label="End Call"
              >
                <FaPhoneSlash />
              </button>
            </>}
          </div>
        </div>
        {/* Close button (top right, floating) */}
        <button
          onClick={onClose}
          className="absolute top-8 right-10 text-white hover:text-primary-400 text-4xl font-bold bg-dark-900/40 rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-md"
          aria-label="Close video call"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default VideoCallModal; 