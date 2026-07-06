import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, getC, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";
import { FIGS } from "../data/figures.jsx";
import { MasteryDots, FieldTabs } from "./common.jsx";

export default function TermDetail({ term, mastery, counts, onClose, onJump, onGraph, onPrev, onNext, canBack, onBack }) {
  const scRef = useRef(null);
  useEffect(() => { if (scRef.current) scRef.current.scrollTop = 0; }, [term]);
  const m = getM(mastery, term.n);
  const c = getC(counts, term.n);
  const forgotten = isForgotten(mastery, term.n);
  const i = idxOf[term.n];

  return (
    <div className="fadein" style={{ position: "fixed", inset: 0, background: "#FBFBF8", zIndex: 40, display: "flex", flexDirection: "column" }}>
      {/* 上部バー */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: `1px solid ${INK}18`, background: "#FBFBF8" }}>
        {canBack && <button onClick={onBack} style={{ border: `1.5px solid ${INK}33`, background: "#fff", borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 700, color: INK }}>← 戻る</button>}
        <div style={{ flex: 1, fontSize: 11, opacity: 0.55, textAlign: "center" }}>{i + 1} / {TERMS.length}</div>
        <button onClick={onClose} style={{ border: "none", background: `${INK}0d`, borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 700, color: INK }}>✕ 閉じる</button>
      </div>

      {/* 本文 */}
      <div ref={scRef} style={{ flex: 1, overflowY: "auto", padding: "18px 20px 24px", maxWidth: 720, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ fontSize: 11, color: FIELD_COLOR[CATF[term.c]], fontWeight: 700, letterSpacing: "0.1em" }}>{FIELDS[CATF[term.c]]}｜{term.c}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "6px 0 4px", gap: 10 }}>
          <h2 className="serif" style={{ fontSize: 25, fontWeight: 700, margin: 0 }}>{term.n}</h2>
          <MasteryDots v={m.v} />
        </div>
        {forgotten && <div style={{ display: "inline-block", fontSize: 11, fontWeight: 800, color: "#fff", background: SHU, borderRadius: 999, padding: "3px 10px", marginBottom: 6 }}>⚠ 忘れかけ(以前は★{m.b})</div>}
        {(c.sd > 0 || c.qd > 0) && (
          <div style={{ fontSize: 11.5, color: "#0008", marginTop: 2 }}>
            🟥 赤シート {c.sd}回(思い出せた{c.sc})　✍️ 演習 {c.qd}回(正解{c.qc})
          </div>
        )}
        <p style={{ fontSize: 15, lineHeight: 1.85, fontWeight: 700, color: INDIGO, marginTop: 8 }}>{term.d}</p>
        <p style={{ fontSize: 14, lineHeight: 1.95, marginTop: 10 }}>{term.x}</p>
        {FIGS[term.n] && (
          <div style={{ marginTop: 14, background: "#fff", border: `1px solid ${INK}1a`, borderRadius: 10, padding: "12px 10px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: "0.15em", marginBottom: 8 }}>◆ 図解</div>
            {FIGS[term.n]}
          </div>
        )}
        {term.calc && (
          <div style={{ marginTop: 14, background: "#F4F7F9", border: `1px solid ${INDIGO}44`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: "0.15em", marginBottom: 6 }}>◆ 計算例</div>
            <pre style={{ fontSize: 12.5, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", fontFamily: "'SFMono-Regular', Consolas, Menlo, monospace" }}>{term.calc}</pre>
          </div>
        )}
        {term.p && (
          <div style={{ marginTop: 14, background: "#FDF6EC", border: `1px solid ${GOLD}66`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.15em", marginBottom: 4 }}>◆ 試験のツボ</div>
            <p style={{ fontSize: 13, lineHeight: 1.85, margin: 0 }}>{term.p}</p>
          </div>
        )}
        {term.pm && (
          <div style={{ marginTop: 14, background: "#F8ECEB", border: `1px solid ${SHU}55`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: SHU, letterSpacing: "0.15em", marginBottom: 4 }}>🎯 午後の視点</div>
            <p style={{ fontSize: 13, lineHeight: 1.85, margin: 0 }}>{term.pm}</p>
          </div>
        )}
        {relsOf(term.n).length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: INDIGO, marginBottom: 8 }}>― 繋がる知識</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {relsOf(term.n).map(r => (
                <button key={r} onClick={() => onJump(r)} style={{ border: `1.5px solid ${INDIGO}55`, background: "#fff", color: INDIGO, borderRadius: 999, padding: "7px 13px", fontSize: 13, fontWeight: 500 }}>
                  {r}{isForgotten(mastery, r) ? " ⚠" : ""}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => onGraph(term.n)} style={{ marginTop: 20, width: "100%", padding: "13px", background: INDIGO, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>🕸 相関マップで見る</button>
      </div>

      {/* 前後の用語へ */}
      <div style={{ display: "flex", gap: 1, borderTop: `1px solid ${INK}18` }}>
        <button onClick={onPrev} style={{ flex: 1, padding: "14px 0 calc(14px + env(safe-area-inset-bottom))", border: "none", background: "#fff", color: INK, fontSize: 13, fontWeight: 700 }}>← 前の用語</button>
        <button onClick={onNext} style={{ flex: 1, padding: "14px 0 calc(14px + env(safe-area-inset-bottom))", border: "none", background: INDIGO, color: "#fff", fontSize: 13, fontWeight: 700 }}>次の用語 →</button>
      </div>
    </div>
  );
}
