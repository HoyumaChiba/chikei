// Firebase 初期化(時録と同じ構成: 匿名Auth + Firestore)
// 設定値は .env(VITE_ プレフィックス)から読み込む
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 匿名ログインしてUIDを返す
export const ensureAuth = () =>
  new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
      if (user) resolve(user.uid);
      else signInAnonymously(auth).catch(reject);
    });
  });
