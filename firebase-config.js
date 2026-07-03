// Configuração central do Firebase — usada pelo site (app.js) e pelo painel (admin-local.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3qvoAUUttlCHC2QEV5Gkz-ucBpRjpIUU",
  authDomain: "ofertasgr.firebaseapp.com",
  projectId: "ofertasgr",
  storageBucket: "ofertasgr.firebasestorage.app",
  messagingSenderId: "124715830090",
  appId: "1:124715830090:web:78cdf5c51b7aefa1f34fb3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db, auth,
  collection, doc, setDoc, getDoc, updateDoc, increment, deleteDoc, onSnapshot,
  signInWithEmailAndPassword, onAuthStateChanged, signOut
};
