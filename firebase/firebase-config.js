// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  geAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBhIWoEvynEbgLN0qi5fvGjOU6B2rByskQ',
  authDomain: 'opiskelija-appi.firebaseapp.com',
  projectId: 'opiskelija-appi',
  storageBucket: 'opiskelija-appi.appspot.com',
  messagingSenderId: '401983017906',
  appId: '1:401983017906:web:ab267a9a97227fcaf08aab',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = geAuth(app);
