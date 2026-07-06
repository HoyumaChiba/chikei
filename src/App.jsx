import React, { useState } from "react";
import { TERMS, byName, idxOf, rankOf, getM, todayStr, INK, INDIGO, SHU, PAPER } from "./lib/terms.js";
import { useProgress } from "./hooks/useProgress.js";
import TermDetail from "./components/TermDetail.jsx";
import Dictionary from "./components/Dictionary.jsx";
import RedSheet from "./components/RedSheet.jsx";
import Quiz from "./components/Quiz.jsx";
import Graph from "./components/Graph.jsx";
import Stats from "./components/Stats.jsx";
import PmGuide from "./components/PmGuide.jsx";

export default function App() {
  const [tab, setTab] = useState("dict");
  const [detail, setDetail] = useState(null);
  const [graphCenter, setGraphCenter] = useState("TLS");
  const [hist, setHist] = useState([]);
  const { mastery, xp, streak, lastDay, counts, update, loaded } = useProgress();

  // ---- 学習イベント(src: "sheet"=赤シート / "quiz"=演習) ----
  const study = (name, ok, src) => {
    update(prev => {
      const cur = getM(prev.mastery, name);
      const v = Math.max(0, Math.min(3, cur.v + (ok ? 1 : -1)));
      const mastery = { ...prev.mastery, [name]: { v, b: Math.max(cur.b, v) } };
      const c = { sd: 0, sc: 0, qd: 0, qc: 0, ...(prev.counts?.[name] || {}) };
      if (src === "sheet") { c.sd += 1; if (ok) c.sc += 1; }
      if (src === "quiz") { c.qd += 1; if (ok) c.qc += 1; }
      const counts = { ...prev.counts, [name]: c };
      const xp = prev.xp + (ok ? 10 : 0);
      let { streak, lastDay } = prev;
      const t = todayStr();
      if (lastDay !== t) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        streak = lastDay === y.toISOString().slice(0, 10) ? streak + 1 : 1;
        lastDay = t;
      }
      return { ...prev, mastery, xp, streak, lastDay, counts };
    });
  };

  // ---- 画面遷移(履歴つき) ----
  const snapshot = () => ({ tab, detailN: detail ? detail.n : null, graphN: graphCenter });
  const pushHist = () => setHist(h => [...h.slice(-19), snapshot()]);
  const openTerm = n => { pushHist(); setDetail(byName[n]); };
  const closeDetail = () => { setDetail(null); setHist([]); };
  const jumpTerm = n => { pushHist(); setDetail(byName[n]); };
  const stepTerm = dir => { const i = (idxOf[detail.n] + dir + TERMS.length) % TERMS.length; pushHist(); setDetail(TERMS[i]); };
  const openGraph = n => { pushHist(); setGraphCenter(n); setDetail(null); setTab("graph"); };
  const recenterGraph = n => { pushHist(); setGraphCenter(n); };
  const goBack = () => {
    setHist(h => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setTab(last.tab);
      setDetail(last.detailN ? byName[last.detailN] : null);
      setGraphCenter(last.graphN);
      return h.slice(0, -1);
    });
  };

  if (!loaded) return <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", color: INDIGO, fontWeight: 700 }}>読み込み中…</div>;

  return (
    <div style={{ minHeight: "100vh", background: PAPER, color: INK }}>
      <header className="app-header">
        <div>
          <span className="serif" style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.08em" }}>知繋</span>
          <span style={{ fontSize: 11, marginLeft: 8, opacity: 0.55, letterSpacing: "0.15em" }}>-chikei- 応用情報 用語帳</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12 }}>
          <span style={{ color: SHU, fontWeight: 700 }}>🔥{streak}日</span>
          <span className="serif" style={{ color: INDIGO, fontWeight: 700 }}>{rankOf(xp)}</span>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "14px 14px 90px" }}>
        {tab === "dict" && <Dictionary mastery={mastery} counts={counts} onOpen={openTerm} />}
        {tab === "sheet" && <RedSheet mastery={mastery} study={(n, ok) => study(n, ok, "sheet")} onOpen={openTerm} />}
        {tab === "quiz" && <Quiz mastery={mastery} study={(n, ok) => study(n, ok, "quiz")} onOpen={openTerm} />}
        {tab === "graph" && <Graph center={graphCenter} recenter={recenterGraph} mastery={mastery} onOpen={openTerm} canBack={hist.length > 0} onBack={goBack} />}
        {tab === "pm" && <PmGuide mastery={mastery} counts={counts} onOpen={openTerm} />}
        {tab === "stats" && <Stats mastery={mastery} xp={xp} streak={streak} />}
      </main>

      {detail && (
        <TermDetail
          term={detail} mastery={mastery} counts={counts}
          onClose={closeDetail} onJump={jumpTerm} onGraph={openGraph}
          onPrev={() => stepTerm(-1)} onNext={() => stepTerm(1)}
          canBack={hist.length > 0} onBack={goBack}
        />
      )}

      <nav className="app-nav">
        {[["dict", "📖", "辞典"], ["sheet", "🟥", "赤シート"], ["quiz", "✍️", "演習"], ["graph", "🕸", "相関"], ["pm", "🎯", "午後"], ["stats", "📜", "記録"]].map(([k, ic, lb]) => (
          <button key={k} onClick={() => { setTab(k); setDetail(null); setHist([]); }}
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: tab === k ? SHU : INK, opacity: tab === k ? 1 : 0.55, fontWeight: tab === k ? 700 : 500, fontSize: 11, padding: "2px 6px", borderBottom: tab === k ? `2px solid ${SHU}` : "2px solid transparent" }}>
            <span style={{ fontSize: 18 }}>{ic}</span>{lb}
          </button>
        ))}
      </nav>
    </div>
  );
}
