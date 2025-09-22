import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAbjyZS-_OfEQP_Nf7Zt_PgLTxa982JfPA",
  authDomain: "campusconnect-72029.firebaseapp.com",
  projectId: "campusconnect-72029",
  storageBucket: "campusconnect-72029.firebasestorage.app",
  messagingSenderId: "21163559091",
  appId: "1:21163559091:web:9c312586e8da376471c8c6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);