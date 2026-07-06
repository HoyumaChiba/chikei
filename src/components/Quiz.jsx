import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";
import { MasteryDots, FieldTabs } from "./common.jsx";

export default function Quiz({ mastery, study, onOpen }) {
  const [field, setField] = useState("ALL");
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [count, setCount] = useState(0);
  const [correct, setCorrect] = useState(0);

  const gen = f => {
    const pool = TERMS.filter(t => f === "ALL" || CATF[t.c] === f);
    const weighted = shuffle(pool).sort((a, b) =>
      (isForgotten(mastery, b.n) ? 1 : 0) - (isForgotten(mastery, a.n) ? 1 : 0) ||
      getM(mastery, a.n).v - getM(mastery, b.n).v
    );
    const ans = weighted[Math.floor(Math.random() * Math.min(weighted.length, 25))];
    const sameCat = shuffle(pool.filter(t => t.c === ans.c && t.n !== ans.n));
    const others = shuffle(pool.filter(t => t.c !== ans.c && t.n !== ans.n));
    const opts = shuffle([ans, ...[...sameCat, ...others].slice(0, 3)]);
    setQ({ ans, opts }); setPicked(null);
  };
  useEffect(() => { gen(field); }, [field]);

  if (!q) return null;
  const pick = t => {
    if (picked) return;
    setPicked(t.n);
    const ok = t.n === q.ans.n;
    study(q.ans.n, ok);
    setCount(c => c + 1); if (ok) setCorrect(c => c + 1);
  };

  return (
    <div className="fadein">
      <FieldTabs field={field} setField={setField} />
      <div style={{ fontSize: 12, textAlign: "right", opacity: 0.6, marginBottom: 8 }}>本日 {correct}/{count} 正解</div>
      <div style={{ background: "#FBFBF8", borderRadius: 16, boxShadow: "0 2px 10px #0002", padding: "20px 18px" }}>
        <div style={{ fontSize: 11, color: FIELD_COLOR[CATF[q.ans.c]], fontWeight: 700 }}>{q.ans.c}</div>
        <p style={{ fontSize: 15, lineHeight: 1.9, margin: "10px 0 16px" }}>{q.ans.d}</p>
        <div className="serif" style={{ fontSize: 14, fontWeight: 700, color: INDIGO, marginBottom: 10 }}>この説明にあたる用語は?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.opts.map(t => {
            const isAns = t.n === q.ans.n, isPick = picked === t.n;
            let bg = "#fff", bd = `1.5px solid ${INK}33`, col = INK;
            if (picked) {
              if (isAns) { bg = "#EAF3EC"; bd = "2px solid #3E7C59"; col = "#2C5940"; }
              else if (isPick) { bg = "#F8ECEB"; bd = `2px solid ${SHU}`; col = SHU; }
              else { col = "#0006"; }
            }
            return (
              <button key={t.n} onClick={() => pick(t)} style={{ textAlign: "left", padding: "13px 14px", borderRadius: 10, border: bd, background: bg, color: col, fontSize: 14, fontWeight: 700 }}>
                {t.n}{picked && isAns ? "　✓" : ""}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="fadein" style={{ marginTop: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: picked === q.ans.n ? "#3E7C59" : SHU }}>
              {picked === q.ans.n ? "正解! +10" : `惜しい。正解は「${q.ans.n}」`}
            </div>
            {q.ans.p && (
              <div style={{ marginTop: 10, background: "#FDF6EC", border: `1px solid ${GOLD}66`, borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.15em" }}>◆ 試験のツボ　</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.8 }}>{q.ans.p}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => onOpen(q.ans.n)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `1.5px solid ${INDIGO}66`, background: "#fff", color: INDIGO, fontSize: 13, fontWeight: 700 }}>解説と繋がり</button>
              <button onClick={() => gen(field)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: INDIGO, color: "#fff", fontSize: 13, fontWeight: 700 }}>次の問題 →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
