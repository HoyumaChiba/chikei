// 学習進捗の永続化フック
// - localStorage に即時キャッシュ(オフライン・初速用)
// - Firestore(chikei_progress/{uid})へデバウンス同期
import { useState, useEffect, useRef, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, ensureAuth } from "../lib/firebase.js";

const LS_KEY = "chikei:v2";
const EMPTY = { mastery: {}, xp: 0, streak: 0, lastDay: null, counts: {} };

// 旧形式(数値のみ)の習熟度を {v,b} に移行
const migrate = s => {
  const mastery = {};
  Object.entries(s.mastery || {}).forEach(([k, v]) => {
    mastery[k] = typeof v === "number" ? { v, b: v } : v;
  });
  return { ...EMPTY, ...s, mastery };
};

export function useProgress() {
  const [state, setState] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const uidRef = useRef(null);
  const timerRef = useRef(null);

  // 初期ロード: localStorage → Firestore(新しい方を採用)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let local = EMPTY;
      try { local = migrate(JSON.parse(localStorage.getItem(LS_KEY) || "{}")); } catch {}
      if (!cancelled) setState(local);
      try {
        const uid = await ensureAuth();
        uidRef.current = uid;
        const snap = await getDoc(doc(db, "chikei_progress", uid));
        if (snap.exists() && !cancelled) {
          const remote = migrate(snap.data());
          // XPが大きい方を「進んでいる」とみなして採用(単純な競合解決)
          if ((remote.xp || 0) >= (local.xp || 0)) setState(remote);
        }
      } catch (e) {
        console.warn("Firestore読み込み失敗(ローカルのみで継続)", e);
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // 保存: localStorageは即時、Firestoreは1.5秒デバウンス
  const persist = useCallback(next => {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!uidRef.current) return;
      setDoc(doc(db, "chikei_progress", uidRef.current), next, { merge: true })
        .catch(e => console.warn("Firestore保存失敗", e));
    }, 1500);
  }, []);

  const update = useCallback(patch => {
    setState(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, [persist]);

  return { ...state, update, loaded };
}
