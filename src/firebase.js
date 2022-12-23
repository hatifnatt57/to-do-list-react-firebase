// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCuJRhyLi1lntO3iSpgZCFJv_wzbhRhjO8",
  authDomain: "to-do-list-7ef67.firebaseapp.com",
  projectId: "to-do-list-7ef67",
  storageBucket: "to-do-list-7ef67.appspot.com",
  messagingSenderId: "391782703822",
  appId: "1:391782703822:web:a4209e620a569999bbe69f"
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
// connectFirestoreEmulator(firestore, 'localhost', 8080);
// connectStorageEmulator(storage, 'localhost', 9199);
// connectAuthEmulator(auth, 'http://localhost:9099');