import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy, increment } from 'firebase/firestore';

export const saveUserProfile = async (user, role) => {
  if (!user) return;
  const userRef = doc(db, 'userProfiles', user.uid);
  const data = {
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    role: role || 'patient',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    emailVerified: user.emailVerified || false,
    providerId: user.providerData[0]?.providerId || 'google.com',
    providerUid: user.providerData[0]?.uid || '',
  };
  await setDoc(userRef, data, { merge: true });
};

export const isEmailRoleConflict = async (email, role) => {
  // Query for any user with this email
  const q = query(collection(db, 'userProfiles'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return false; // No user with this email
  // If any user with this email has a different role, return true
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    if (data.role && data.role !== role) {
      return true;
    }
  }
  return false;
};

export const getAllDoctors = async () => {
  const q = query(collection(db, 'userProfiles'), where('role', '==', 'doctor'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllPatients = async () => {
  const q = query(collection(db, 'userProfiles'), where('role', '==', 'patient'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const scheduleChat = async (chatData) => {
  // chatData should include doctorId, patientId, doctorName, patientName, date, time, etc.
  const ref = collection(db, 'scheduledChats');
  await addDoc(ref, chatData);
};

export const getScheduledChatsForDoctor = async (doctorId) => {
  const q = query(collection(db, 'scheduledChats'), where('doctorId', '==', doctorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createOrGetChat = async (chatId, participants) => {
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants,
      createdAt: new Date().toISOString(),
      lastMessage: '',
      lastTimestamp: null,
      unreadCountPatient: 0,
      unreadCountDoctor: 0,
    });
  }
  return chatRef;
};

export const sendMessageToChat = async (chatId, messageData) => {
  const chatRef = doc(db, 'chats', chatId);
  const messagesRef = collection(chatRef, 'messages');
  await addDoc(messagesRef, messageData);
  // Optionally update lastMessage/lastTimestamp
  // Determine which unread count to increment
  const incrementField = messageData.senderRole === 'patient' ? 'unreadCountDoctor' : 'unreadCountPatient';

  await setDoc(chatRef, {
    lastMessage: messageData.text,
    lastTimestamp: messageData.timestamp,
    [incrementField]: increment(1), // Increment the unread count
  }, { merge: true });
};

export const getChatDocument = async (chatId) => {
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);
  return chatSnap.exists() ? { id: chatSnap.id, ...chatSnap.data() } : null;
};

export const listenForChatMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const listenForChatDocChanges = (chatId, callback) => {
  const chatRef = doc(db, 'chats', chatId);
  return onSnapshot(chatRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
};

export const resetUnreadCount = async (chatId, userId, userRole) => {
  const chatRef = doc(db, 'chats', chatId);
  let updateData = {};
  if (userRole === 'patient') {
    updateData.unreadCountPatient = 0;
  } else if (userRole === 'doctor') {
    updateData.unreadCountDoctor = 0;
  }
  if (Object.keys(updateData).length > 0) {
    await setDoc(chatRef, updateData, { merge: true });
  }
};

export const saveChatReport = async (reportData) => {
  try {
    const reportRef = await addDoc(collection(db, 'chat_reports'), {
      ...reportData,
      createdAt: new Date(),
    });
    console.log("Report saved with ID: ", reportRef.id);
    return reportRef.id;
  } catch (error) {
    console.error("Error saving chat report: ", error);
    throw error;
  }
};

export const getChatReportsForPatient = async (patientId) => {
  try {
    const reportsQuery = query(
      collection(db, 'chat_reports'),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(reportsQuery);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reports;
  } catch (error) {
    console.error("Error fetching chat reports: ", error);
    throw error;
  }
};
