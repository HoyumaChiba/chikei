import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";
import { MasteryDots, FieldTabs } from "./common.jsx";

export default function RedSheet({ mastery, study, onOpen }) {
  const [field, setField] = useState("ALL");
  const [deck, setDeck] = useState([]);
  const [i, setI] = useState(0);
  const [lifted, setLifted] = useState(false);

  const build = f => {
    const pool = TERMS.filter(t => f === "ALL" || CATF[t.c] === f);
    // 忘れかけを最優先し、次に習熟度の低い順
    setDeck(shuffle(pool).sort((a, b) =>
      (isForgotten(mastery, b.n) ? 1 : 0) - (isForgotten(mastery, a.n) ? 1 : 0) ||
      getM(mastery, a.n).v - getM(mastery, b.n).v
    ).slice(0, 20));
    setI(0); setLifted(false);
  };
  useEffect(() => { build(field); }, [field]);

  const cur = deck[i];
  const next = ok => { study(cur.n, ok); setLifted(false); setI(x => x + 1); };

  if (!cur) return (
    <div className="fadein" style={{ textAlign: "center", padding: "60px 20px" }}>
      <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: INDIGO }}>一巡おつかれさま</div>
      <p style={{ fontSize: 14, opacity: 0.7, margin: "10px 0 24px" }}>20語の暗記を終えました。忘れかけ→習熟の浅い順に、次も出題されます。</p>
      <button onClick={() => build(field)} style={{ padding: "12px 32px", background: SHU, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700 }}>もう一巡する</button>
    </div>
  );

  return (
    <div className="fadein">
      <FieldTabs field={field} setField={setField} />
      <div style={{ fontSize: 12, textAlign: "center", opacity: 0.6, margin: "4px 0 10px" }}>{i + 1} / {deck.length}　·　説明から用語を思い浮かべて赤シートをめくる</div>
      <div style={{ background: "#FBFBF8", borderRadius: 16, boxShadow: "0 2px 10px #0002", padding: "22px 20px", minHeight: 300, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: FIELD_COLOR[CATF[cur.c]], fontWeight: 700 }}>{cur.c}</div>
          {isForgotten(mastery, cur.n) && <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: SHU, borderRadius: 999, padding: "2px 8px" }}>忘れかけ</div>}
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.95, margin: "12px 0 20px", flex: 1 }}>{cur.d}</p>
        {/* 赤シート */}
        <button onClick={() => setLifted(true)} disabled={lifted} style={{ position: "relative", border: "none", borderRadius: 12, overflow: "hidden", padding: 0, minHeight: 74, background: "#fff" }}>
          <div className="serif" style={{ fontSize: 24, fontWeight: 800, color: SHU, padding: "20px 10px", letterSpacing: "0.05em" }}>{cur.n}</div>
          {!lifted && (
            <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(135deg, ${SHU} 0 12px, #B33430 12px 24px)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em" }}>
              赤シートをめくる
            </div>
          )}
        </button>
        {lifted && cur.p && (
          <div className="fadein" style={{ marginTop: 12, background: "#FDF6EC", border: `1px solid ${GOLD}66`, borderRadius: 10, padding: "10px 12px" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.15em" }}>◆ 試験のツボ　</span>
            <span style={{ fontSize: 12.5, lineHeight: 1.8 }}>{cur.p}</span>
          </div>
        )}
        {lifted && (
          <div className="fadein" style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={() => next(false)} style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: `1.5px solid ${INK}44`, background: "#fff", color: INK, fontSize: 14, fontWeight: 700 }}>まだ怪しい</button>
            <button onClick={() => next(true)} style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: "none", background: GOLD, color: "#fff", fontSize: 14, fontWeight: 700 }}>思い出せた +10</button>
          </div>
        )}
        {lifted && <button onClick={() => onOpen(cur.n)} style={{ marginTop: 10, background: "none", border: "none", color: INDIGO, fontSize: 13, textDecoration: "underline" }}>詳しい解説と繋がりを見る</button>}
      </div>
    </div>
  );
}
