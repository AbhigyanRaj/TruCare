import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaComments, FaCalendarAlt, FaEnvelope, FaTimes } from 'react-icons/fa';
import { getAllPatients, getScheduledChatsForDoctor, createOrGetChat, sendMessageToChat, listenForChatMessages, listenForChatDocChanges, resetUnreadCount, getChatDocument } from '../../services/firestore';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'chat' or 'view'
  const [modalData, setModalData] = useState(null);
  const [scheduledChats, setScheduledChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatListener, setChatListener] = useState(null);
  const [chatPatient, setChatPatient] = useState(null);
  const [chatMessagesDirect, setChatMessagesDirect] = useState([]);
  const [chatInputDirect, setChatInputDirect] = useState('');
  const [chatLoadingDirect, setChatLoadingDirect] = useState(false);
  const [chatListenerDirect, setChatListenerDirect] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const chatBodyRef = useRef(null);
  const chatBodyRefDirect = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatBodyRefDirect.current) {
      chatBodyRefDirect.current.scrollTop = chatBodyRefDirect.current.scrollHeight;
    }
  }, [chatMessagesDirect]);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (err) {
        setPatients([]);
      }
      setLoading(false);
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchScheduledChats = async () => {
      if (!currentUser) return;
      setLoadingChats(true);
      try {
        const chats = await getScheduledChatsForDoctor(currentUser.uid);
        setScheduledChats(chats);
      } catch (err) {
        setScheduledChats([]);
      }
      setLoadingChats(false);
    };
    fetchScheduledChats();
  }, [currentUser]);

  // Listen for unread counts for each patient
  useEffect(() => {
    if (!currentUser || (!patients.length && !scheduledChats.length)) return;

    const unsubscribes = [];

    // Listen for direct chat unread counts
    patients.forEach(patient => {
      const chatId = `${currentUser.uid}_${patient.id}`;
      const unsub = listenForChatDocChanges(chatId, (chatDoc) => {
        if (chatDoc) {
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [patient.id]: chatDoc.unreadCountDoctor || 0,
          }));
        }
      });
      unsubscribes.push(unsub);
    });

    // Listen for scheduled chat unread counts (using chat ID as key)
    scheduledChats.forEach(chat => {
      const unsub = listenForChatDocChanges(chat.id, (chatDoc) => {
        if (chatDoc) {
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [chat.id]: chatDoc.unreadCountDoctor || 0,
          }));
        }
      });
      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [patients, scheduledChats, currentUser]);

  // Listen for messages when scheduled chat modal opens
  useEffect(() => {
    if (modalOpen && modalType === 'view' && modalData && modalData.id) {
      const chatId = modalData.id;
      const participants = [
        modalData.doctorId, 
        modalData.patientId
      ]; // Assuming these are available in modalData

      setChatMessages([]);
      setChatLoading(true);

      createOrGetChat(chatId, participants).then(() => {
        const unsub = listenForChatMessages(chatId, (msgs) => {
          setChatMessages(msgs);
          setChatLoading(false);
        });
        // Directly return unsub for cleanup
        return unsub;
      }).catch(err => {
        console.error('Error creating/getting chat:', err);
        setChatLoading(false);
      });

      // Reset unread count when scheduled chat is opened
      if (currentUser) {
        resetUnreadCount(chatId, currentUser.uid, 'doctor');
      }
    }
    // eslint-disable-next-line
  }, [modalOpen, modalType, modalData, currentUser]);

  // Listen for messages when direct chat modal opens
  useEffect(() => {
    if (chatPatient && currentUser) {
      const chatId = `${currentUser.uid}_${chatPatient.id}`;
      const participants = [currentUser.uid, chatPatient.id];
      setChatMessagesDirect([]);
      setChatLoadingDirect(true);
      createOrGetChat(chatId, participants).then(() => {
        const unsub = listenForChatMessages(chatId, (msgs) => {
          setChatMessagesDirect(msgs);
          setChatLoadingDirect(false);
        });
        // Directly return unsub for cleanup
        return unsub;
      }).catch(err => {
        console.error('Error creating/getting direct chat:', err);
        setChatLoadingDirect(false);
      });

      // Reset unread count when direct chat is opened
      if (currentUser) {
        resetUnreadCount(chatId, currentUser.uid, 'doctor');
      }
    }
    // eslint-disable-next-line
  }, [chatPatient, currentUser]);

  const openModal = (type, data) => {
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
    setModalType('');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !modalData || !modalData.id) return;

    const messageToSend = chatInput;
    setChatInput(''); // Clear input immediately
    setChatLoading(true);
    try {
      await sendMessageToChat(modalData.id, {
        senderId: currentUser.uid,
        senderRole: 'doctor',
        senderName: currentUser.displayName || currentUser.email || 'Unknown Doctor',
        senderImage: currentUser.photoURL || '',
        text: messageToSend,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Error sending message to scheduled chat:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessageDirect = async () => {
    if (!chatInputDirect.trim() || !chatPatient) return;

    const messageToSend = chatInputDirect;
    setChatInputDirect(''); // Clear input immediately
    setChatLoadingDirect(true);
    const chatId = `${currentUser.uid}_${chatPatient.id}`;
    try {
      await sendMessageToChat(chatId, {
        senderId: currentUser.uid,
        senderRole: 'doctor',
        senderName: currentUser.displayName || currentUser.email || 'Unknown Doctor',
        senderImage: currentUser.photoURL || '',
        text: messageToSend,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Error sending message to direct chat:', err);
    } finally {
      setChatLoadingDirect(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

          {/* Patient Users Section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Patients</h2>
            {loading ? (
              <div className="text-gray-500 text-center py-8">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No patients found.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {patients.map((patient) => (
                  <li key={patient.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 rounded-lg p-4 sm:p-5 mb-4 hover:shadow transition group">
                    <img src={patient.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.displayName || patient.name || patient.email || 'Unknown Patient')}&background=E5E7EB&color=374151`} alt={patient.displayName || patient.name || patient.email || 'Unknown Patient'} className="w-12 h-12 rounded-full object-cover mr-4 mb-2 sm:mb-0 shrink-0" />
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex items-center justify-between flex-wrap">
                        <div className="font-medium text-gray-900 text-base break-words min-w-0 sm:max-w-[calc(100%-60px)]">{patient.displayName || patient.name || patient.email || 'Unknown Patient'}</div>
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold ml-auto sm:ml-2 mt-2 sm:mt-0 whitespace-nowrap">Patient</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1 break-words"> 
                        <FaEnvelope className="mr-1" /> {patient.email || 'Unknown' }
                      </div>
                    </div>
                    <div className="flex flex-col items-end w-full sm:w-auto ml-0 sm:ml-4 mt-4 sm:mt-0">
                      <button
                        className="w-full sm:w-auto flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm relative"
                        onClick={() => setChatPatient(patient)}
                      >
                        <FaComments className="mr-2" /> Chat
                        {unreadCounts[patient.id] > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCounts[patient.id]}
                          </span>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Scheduled Chats */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Scheduled Chats</h2>
            {loadingChats ? (
              <div className="text-gray-500 text-center py-8">Loading scheduled chats...</div>
            ) : scheduledChats.length === 0 ? (
              <div className="text-gray-500 text-center py-8">This feature is coming soon.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {scheduledChats.map((chat) => (
                  <li key={chat.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 rounded-lg p-4 sm:p-5 mb-4 hover:shadow transition group">
                    <img src={chat.patientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.patientName || chat.patientEmail || 'Unknown Patient')}&background=E5E7EB&color=374151`} alt={chat.patientName || 'Unknown Patient'} className="w-12 h-12 rounded-full object-cover mr-4 mb-2 sm:mb-0 shrink-0" />
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex items-center justify-between flex-wrap">
                        <div className="font-medium text-gray-900 text-base break-words min-w-0 sm:max-w-[calc(100%-60px)]">{chat.patientName || 'Unknown Patient'}</div>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold ml-auto sm:ml-2 mt-2 sm:mt-0 whitespace-nowrap">{chat.status || 'Scheduled'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1 break-words">
                        <FaEnvelope className="mr-1" /> {chat.patientEmail || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 break-words">{chat.date} at {chat.time}</div>
                    </div>
                    <div className="flex flex-col items-end w-full sm:w-auto ml-0 sm:ml-4 mt-4 sm:mt-0">
                      <button
                        className="w-full sm:w-auto flex items-center justify-center bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors shadow-sm relative"
                        onClick={() => openModal('view', chat)}
                      >
                        <FaCalendarAlt className="mr-2" /> View
                        {unreadCounts[chat.id] > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCounts[chat.id]}
                          </span>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Chat/View */}
      {modalOpen && modalData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-0 z-50 sm:p-4">
          <div className="bg-white rounded-none w-full h-full shadow-2xl flex flex-col relative sm:rounded-3xl sm:max-w-lg sm:max-h-[90vh] sm:min-h-[400px] overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-600 text-white">
              <div className="flex items-center space-x-3">
                <img
                  src={modalData.patientImage || 'https://ui-avatars.com/api/?name=Unknown+Patient&background=E5E7EB&color=374151'}
                  alt={modalData.patientName || 'Unknown Patient'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white ring-opacity-50"
                />
                <div>
                  <h3 className="text-xl font-semibold">{modalData.patientName || 'Unknown Patient'}</h3>
                  <p className="text-sm text-green-100">Patient</p>
                </div>
              </div>
              <button
                className="text-white hover:text-green-100 transition-colors"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {modalType === 'view' ? (
              <>
                <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 flex flex-col space-y-4 pb-24">
                  {chatLoading ? (
                    <div className="text-center text-gray-400 py-8">Loading messages...</div>
                  ) : chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No messages yet. Start the conversation!</div>
                  ) : (
                    chatMessages.map(msg => (
                      <div key={msg.id} className={`flex items-end ${msg.senderId === currentUser.uid ? 'justify-end space-x-2' : 'justify-start space-x-2'}`}> 
                        {msg.senderId !== currentUser.uid && (
                          <img
                            src={modalData.patientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(modalData.patientName || modalData.patientEmail || 'Unknown Patient')}&background=E5E7EB&color=374151`}
                            alt={modalData.patientName || 'Unknown Patient'}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        )}
                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${msg.senderId === currentUser.uid ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'} transition-opacity duration-200 ease-out`}>
                          <div>{msg.text}</div>
                          <div className={`text-xs mt-1 ${msg.senderId === currentUser.uid ? 'text-green-200 text-right' : 'text-gray-500 text-left'}`}>{msg.timestamp && new Date(msg.timestamp.seconds ? msg.timestamp.seconds * 1000 : msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        {msg.senderId === currentUser.uid && (
                          <img
                            src={msg.senderImage || currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || currentUser?.email || 'Unknown Doctor')}&background=E5E7EB&color=374151`}
                            alt={currentUser.displayName || currentUser.email || 'Unknown Doctor'}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="absolute bottom-0 w-full flex items-center gap-3 px-4 py-4 border-t border-gray-100 bg-white">
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
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Direct Chat Modal */}
      {chatPatient && currentUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-0 z-50 sm:p-4">
          <div className="bg-white rounded-none w-full h-full shadow-2xl flex flex-col relative sm:rounded-3xl sm:max-w-lg sm:max-h-[90vh] sm:min-h-[400px] overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-600 text-white">
              <div className="flex items-center space-x-3">
                <img
                  src={chatPatient.image || 'https://ui-avatars.com/api/?name=Unknown+Patient&background=E5E7EB&color=374151'}
                  alt={chatPatient.displayName || chatPatient.name || chatPatient.email || 'Unknown Patient'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white ring-opacity-50"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {chatPatient.displayName || chatPatient.name || chatPatient.email || 'Unknown Patient'}
                  </h3>
                  <p className="text-sm text-green-100">Patient</p>
                </div>
              </div>
              <button
                onClick={() => setChatPatient(null)}
                className="text-white hover:text-green-100 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 flex flex-col space-y-4 pb-24">
              {chatLoadingDirect ? (
                <div className="text-center text-gray-400 py-8">Loading messages...</div>
              ) : chatMessagesDirect.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No messages yet. Start the conversation!</div>
              ) : (
                chatMessagesDirect.map(msg => (
                  <div key={msg.id} className={`flex items-end ${msg.senderId === currentUser.uid ? 'justify-end space-x-2' : 'justify-start space-x-2'}`}> 
                    {msg.senderId !== currentUser.uid && (
                      <img
                        src={chatPatient.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatPatient.displayName || chatPatient.name || chatPatient.email || 'Unknown Patient')}&background=E5E7EB&color=374151`}
                        alt={chatPatient.displayName || chatPatient.name || chatPatient.email || 'Unknown Patient'}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${msg.senderId === currentUser.uid ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'} transition-opacity duration-200 ease-out`}>
                      <div>{msg.text}</div>
                      <div className={`text-xs mt-1 ${msg.senderId === currentUser.uid ? 'text-green-200 text-right' : 'text-gray-500 text-left'}`}>{msg.timestamp && new Date(msg.timestamp.seconds ? msg.timestamp.seconds * 1000 : msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    {msg.senderId === currentUser.uid && (
                      <img
                        src={msg.senderImage || currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || currentUser?.email || 'Unknown Doctor')}&background=E5E7EB&color=374151`}
                        alt={currentUser.displayName || currentUser.email || 'Unknown Doctor'}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="absolute bottom-0 w-full flex items-center gap-3 px-4 py-4 border-t border-gray-100 bg-white">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={chatInputDirect}
                onChange={e => setChatInputDirect(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessageDirect(); }}
                autoFocus
              />
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessageDirect}
                disabled={!chatInputDirect.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard; 