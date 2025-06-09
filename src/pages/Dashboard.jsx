import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaComments, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { getAllDoctors, scheduleChat, createOrGetChat, sendMessageToChat, listenForChatMessages, listenForChatDocChanges, resetUnreadCount, getChatDocument } from '../services/firestore';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatListener, setChatListener] = useState(null);
  const [scheduledChats, setScheduledChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const docs = await getAllDoctors();
        setDoctors(docs);
      } catch (err) {
        setDoctors([]);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  // Listen for unread counts for each doctor
  useEffect(() => {
    if (!currentUser || !doctors.length) return;

    const unsubscribes = [];

    doctors.forEach(doctor => {
      const chatId = `${doctor.id}_${currentUser.uid}`;
      const unsub = listenForChatDocChanges(chatId, (chatDoc) => {
        if (chatDoc) {
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [doctor.id]: chatDoc.unreadCountPatient || 0,
          }));
        }
      });
      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [doctors, currentUser]);

  const handleStartChat = (doctor) => {
    setSelectedDoctor(doctor);
    setShowChatModal(true);
    // Reset unread count when chat is opened
    if (currentUser) {
      const chatId = `${doctor.id}_${currentUser.uid}`;
      resetUnreadCount(chatId, currentUser.uid, 'patient');
    }
  };

  const handleScheduleChat = (doctor) => {
    setSelectedDoctor(doctor);
    setShowScheduleModal(true);
  };

  // Helper to get chatId: use scheduled chat's Firestore ID if available, else fallback
  const getChatId = () => {
    if (selectedDoctor && currentUser) {
      const scheduledChat = scheduledChats && scheduledChats.find(
        chat => chat.doctorId === selectedDoctor.id && chat.patientId === currentUser.uid
      );
      if (scheduledChat) return scheduledChat.id;
      return `${selectedDoctor.id}_${currentUser.uid}`;
    }
    return '';
  };

  // Listen for messages when chat modal opens
  useEffect(() => {
    if (showChatModal && selectedDoctor && currentUser) {
      const chatId = getChatId();
      const participants = [selectedDoctor.id, currentUser.uid];
      setChatMessages([]);
      setChatLoading(true);
      createOrGetChat(chatId, participants).then(() => {
        const unsub = listenForChatMessages(chatId, (msgs) => {
          setChatMessages(msgs);
          setChatLoading(false);
        });
        // Directly return unsub for cleanup
        return unsub;
      });
    }
    // eslint-disable-next-line
  }, [showChatModal, selectedDoctor, currentUser]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const messageToSend = chatInput;
    setChatInput(''); // Clear input immediately
    setChatLoading(true); // Indicate loading state

    const chatId = getChatId();
    try {
      await sendMessageToChat(chatId, {
        senderId: currentUser.uid,
        senderRole: 'patient',
        senderName: currentUser.displayName || currentUser.email || 'Unknown Patient',
        senderImage: currentUser.photoURL || '',
        text: messageToSend,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setChatLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-gray-900">
            Welcome back, <span className="font-medium">{currentUser?.displayName || 'Patient'}</span>
          </h1>
          <p className="mt-2 text-gray-500">
            Connect with our mental health professionals
          </p>
        </div>

        {/* Available Doctors Section */}
        <div className="space-y-8">
          <h2 className="text-xl font-light text-gray-900">
            Available Doctors
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No doctors are available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="group bg-white rounded-3xl border border-gray-100 hover:border-green-100 transition-all duration-200 overflow-hidden flex flex-col justify-center h-full"
                >
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <img
                      src={doctor.image || 'https://ui-avatars.com/api/?name=Unknown+Doctor&background=E5E7EB&color=374151'}
                      alt={doctor.displayName || doctor.email || 'Unknown Doctor'}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-green-50 mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 text-center">{doctor.displayName || doctor.name || doctor.email || 'Unknown Doctor'}</h3>
                    <p className="text-sm text-gray-500 text-center mb-2">{doctor.specialization || 'Unknown'}</p>
                    <div className="flex items-center text-sm text-gray-500 justify-center mb-1">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{doctor.rating !== undefined && doctor.rating !== null ? doctor.rating : '—'}</span>
                      <span className="mx-2">•</span>
                      <span>{doctor.experience || '—'}</span>
                    </div>
                    <p className="text-sm text-gray-500 text-center mb-4">{doctor.availability || 'Availability: Unknown'}</p>
                    <div className="flex space-x-3 w-full mt-auto">
                      <button
                        onClick={() => handleStartChat(doctor)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium relative"
                      >
                        <FaComments className="text-sm" />
                        <span>Chat Now</span>
                        {unreadCounts[doctor.id] > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCounts[doctor.id]}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleScheduleChat(doctor)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-white text-green-600 border border-green-200 px-4 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <FaCalendarAlt className="text-sm" />
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Modal */}
        {showChatModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-0 z-50 sm:p-4">
            <div className="bg-white w-full h-full shadow-2xl flex flex-col relative sm:rounded-3xl sm:max-w-lg sm:max-h-[90vh] sm:min-h-[400px] overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-600 text-white">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedDoctor.image || 'https://ui-avatars.com/api/?name=Unknown+Doctor&background=E5E7EB&color=374151'}
                    alt={selectedDoctor.displayName || selectedDoctor.name || selectedDoctor.email || 'Unknown Doctor'}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white ring-opacity-50"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedDoctor.displayName || selectedDoctor.name || selectedDoctor.email || 'Unknown Doctor'}
                    </h3>
                    <p className="text-sm text-green-100">{selectedDoctor.specialization || 'Doctor'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Chat Body */}
              <div ref={chatBodyRef} className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 flex flex-col space-y-4 pb-24">
                {chatLoading ? (
                  <div className="text-center text-gray-400 py-8">Loading messages...</div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No messages yet. Start the conversation!</div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className={`flex items-end ${msg.senderId === currentUser.uid ? 'justify-end space-x-2' : 'justify-start space-x-2'}`}> 
                      {msg.senderId !== currentUser.uid && (
                        <img
                          src={selectedDoctor.image || 'https://ui-avatars.com/api/?name=Unknown+Doctor&background=E5E7EB&color=374151'}
                          alt={selectedDoctor.displayName || selectedDoctor.name || selectedDoctor.email || 'Unknown Doctor'}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      )}
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${msg.senderId === currentUser.uid ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'} transition-opacity duration-200 ease-out`}>
                        <div>{msg.text}</div>
                        <div className={`text-xs mt-1 ${msg.senderId === currentUser.uid ? 'text-green-200 text-right' : 'text-gray-500 text-left'}`}>{msg.timestamp && new Date(msg.timestamp.seconds ? msg.timestamp.seconds * 1000 : msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      {msg.senderId === currentUser.uid && (
                        <img
                          src={msg.senderImage || currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'Unknown Patient')}&background=E5E7EB&color=374151`}
                          alt={currentUser.displayName || currentUser.email || 'Unknown Patient'}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
              {/* Chat Input */}
              <div className="absolute bottom-0 w-full flex items-center gap-3 px-4 py-4 border-t border-gray-100 bg-white rounded-b-3xl">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                  autoFocus
                />
                <button
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-green-50"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Schedule with {selectedDoctor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setScheduleLoading(true);
                  setScheduleError('');
                  setScheduleSuccess(false);
                  try {
                    const chatData = {
                      doctorId: selectedDoctor.id,
                      doctorName: selectedDoctor.displayName || selectedDoctor.name || selectedDoctor.email || 'Unknown Doctor',
                      patientId: currentUser.uid,
                      patientName: currentUser.displayName || currentUser.email || 'Unknown Patient',
                      patientEmail: currentUser.email || '',
                      patientImage: currentUser.photoURL || '',
                      date: scheduleDate,
                      time: scheduleTime,
                      status: 'Scheduled',
                      createdAt: new Date().toISOString(),
                    };
                    console.log('Scheduling chat with:', chatData);
                    await scheduleChat(chatData);
                    setScheduleSuccess(true);
                    setScheduleDate('');
                    setScheduleTime('');
                  } catch (err) {
                    setScheduleError('Failed to schedule chat. Please try again.');
                  }
                  setScheduleLoading(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {scheduleError && <div className="text-red-600 text-sm">{scheduleError}</div>}
                {scheduleSuccess && <div className="text-green-600 text-sm">Chat scheduled successfully!</div>}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  disabled={scheduleLoading}
                >
                  {scheduleLoading ? 'Scheduling...' : 'Schedule Session'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;