import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';

export const saveUserProfile = async (user, role) => {
  if (!user) return;
  const userRef = doc(db, 'userProfiles', user.uid);
  const data = {
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    displayName: user.displayName || '',
    role: role || 'patient',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
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
    });
  }
  return chatRef;
};

export const sendMessageToChat = async (chatId, messageData) => {
  const chatRef = doc(db, 'chats', chatId);
  const messagesRef = collection(chatRef, 'messages');
  await addDoc(messagesRef, messageData);
  // Optionally update lastMessage/lastTimestamp
  await setDoc(chatRef, {
    lastMessage: messageData.text,
    lastTimestamp: messageData.timestamp,
  }, { merge: true });
};

export const listenForChatMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};
