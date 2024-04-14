import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSCY_BSZTC1bPbdy2zIRtU8qSV_PJm9ZI",
  authDomain: "accessibleemergencybutton.firebaseapp.com",
  databaseURL:
    "https://accessibleemergencybutton-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "accessibleemergencybutton",
  storageBucket: "accessibleemergencybutton.appspot.com",
  messagingSenderId: "805840268989",
  appId: "1:805840268989:web:c4364484c03b9ce94511d4",
  measurementId: "G-Q2BBV9NH5R",
};

const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app);

export const db = getFirestore(app);
