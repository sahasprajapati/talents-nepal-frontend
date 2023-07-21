import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAeARXVIAeGE1TZqykDY_8FmUxVxmiJuaU',
  authDomain: 'talents-nepal.firebaseapp.com',
  projectId: 'talents-nepal',
  storageBucket: 'talents-nepal.appspot.com',
  messagingSenderId: '16255866387',
  appId: '1:16255866387:web:9e57a52dcb0f5ced9851e6',
  measurementId: 'G-DY7278GHTB',
}

const firebase = initializeApp(firebaseConfig)

export const firestore = getFirestore(firebase)
