import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, getC, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";
import { MasteryDots, FieldTabs } from "./common.jsx";

export default function Dictionary({ mastery, counts, onOpen }) {
  const [field, setField] = useState("ALL");
  const [q, setQ] = useState("");
  const [openCat, setOpenCat] = useState(null);
  const [onlyForgot, setOnlyForgot] = useState(false);
  const [onlyPm, setOnlyPm] = useState(false);
  const filtered = useMemo(() => TERMS.filter(t =>
    (field === "ALL" || CATF[t.c] === field) &&
    (!onlyForgot || isForgotten(mastery, t.n)) &&
    (!onlyPm || t.pm) &&
    (!q || t.n.includes(q) || t.d.includes(q) || t.x.includes(q))
  ), [field, q, onlyForgot, onlyPm, mastery]);
  const cats = CATS.filter(([c, f]) => (field === "ALL" || f === field) && filtered.some(t => t.c === c));
  const forgotCount = TERMS.filter(t => isForgotten(mastery, t.n)).length;

  return (
    <div className="fadein">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="用語や説明文を検索"
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${INK}33`, background: "#fff", fontSize: 15, marginBottom: 10, boxSizing: "border-box" }} />
      <FieldTabs field={field} setField={f => { setField(f); setOpenCat(null); }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {forgotCount > 0 && (
          <button onClick={() => setOnlyForgot(v => !v)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, border: `1.5px solid ${SHU}`, background: onlyForgot ? SHU : "#fff", color: onlyForgot ? "#fff" : SHU }}>
            ⚠ 忘れかけ {forgotCount}語{onlyForgot ? "(解除)" : ""}
          </button>
        )}
        <button onClick={() => setOnlyPm(v => !v)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, border: `1.5px solid ${INDIGO}`, background: onlyPm ? INDIGO : "#fff", color: onlyPm ? "#fff" : INDIGO }}>
          🎯 午後頻出だけ{onlyPm ? "(解除)" : ""}
        </button>
      </div>
      {(q || onlyForgot || onlyPm) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(t => <TermRow key={t.n} t={t} mastery={mastery} counts={counts} onOpen={onOpen} />)}
          {filtered.length === 0 && <p style={{ textAlign: "center", opacity: 0.6, padding: 30 }}>該当する用語がありません。</p>}
        </div>
      ) : (
        cats.map(([c, f]) => {
          const list = filtered.filter(t => t.c === c);
          const done = list.filter(t => getM(mastery, t.n).v >= 3).length;
          const forgot = list.filter(t => isForgotten(mastery, t.n)).length;
          const open = openCat === c;
          return (
            <div key={c} style={{ marginBottom: 10, background: "#FBFBF8", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px #0001" }}>
              <button onClick={() => setOpenCat(open ? null : c)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px", background: "none", border: "none", borderLeft: `4px solid ${FIELD_COLOR[f]}` }}>
                <span className="serif" style={{ fontSize: 15, fontWeight: 700, color: INK }}>{c}{forgot > 0 && <span style={{ fontSize: 11, color: SHU, fontWeight: 800 }}>　⚠{forgot}</span>}</span>
                <span style={{ fontSize: 12, color: done === list.length ? GOLD : "#0007", fontWeight: 700 }}>{done}/{list.length} 修得 {open ? "▴" : "▾"}</span>
              </button>
              {open && <div style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                {list.map(t => <TermRow key={t.n} t={t} mastery={mastery} counts={counts} onOpen={onOpen} />)}
              </div>}
            </div>
          );
        })
      )}
    </div>
  );
}

function TermRow({ t, mastery, counts, onOpen }) {
  const m = getM(mastery, t.n);
  const c = getC(counts, t.n);
  const forgotten = isForgotten(mastery, t.n);
  return (
    <button onClick={() => onOpen(t.n)} style={{ textAlign: "left", background: "#fff", border: forgotten ? `1.5px solid ${SHU}88` : "1px solid #0001", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>
          {t.n}
          {t.pm && <span style={{ fontSize: 10, fontWeight: 800, color: INDIGO, border: `1px solid ${INDIGO}66`, borderRadius: 999, padding: "1px 6px", marginLeft: 6, verticalAlign: "middle" }}>午後</span>}
          {forgotten && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: SHU, borderRadius: 999, padding: "2px 7px", marginLeft: 6, verticalAlign: "middle" }}>忘れかけ ★{m.b}→{m.v}</span>}
        </div>
        <div style={{ fontSize: 12, color: "#0008", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.d}</div>
        {(c.sd > 0 || c.qd > 0) && (
          <div style={{ fontSize: 10.5, color: "#0006", marginTop: 2 }}>🟥 {c.sc}/{c.sd}回　✍️ {c.qc}/{c.qd}回</div>
        )}
      </div>
      <MasteryDots v={m.v} />
    </button>
  );
}
