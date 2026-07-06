import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";
import { MasteryDots, FieldTabs } from "./common.jsx";

export default function Graph({ center, recenter, mastery, onOpen, canBack, onBack }) {
  const [q, setQ] = useState("");
  const c = byName[center] || TERMS[0];
  const rels = relsOf(c.n);
  const W = 340, H = 360, cx = W / 2, cy = H / 2 - 10, R = 118;
  const nodes = rels.map((n, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / rels.length;
    return { n, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const hits = q ? TERMS.filter(t => t.n.includes(q)).slice(0, 6) : [];

  return (
    <div className="fadein">
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        {canBack && <button onClick={onBack} style={{ border: `1.5px solid ${INK}33`, background: "#fff", borderRadius: 10, padding: "0 14px", fontSize: 13, fontWeight: 700, color: INK, flexShrink: 0 }}>← 戻る</button>}
        <div style={{ position: "relative", flex: 1 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="中心に置く用語を検索"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${INK}33`, background: "#fff", fontSize: 15, boxSizing: "border-box" }} />
          {hits.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 4px 14px #0003", zIndex: 10, overflow: "hidden" }}>
              {hits.map(t => <button key={t.n} onClick={() => { recenter(t.n); setQ(""); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", background: "none", border: "none", fontSize: 14, borderBottom: "1px solid #0000000d" }}>{t.n}</button>)}
            </div>
          )}
        </div>
      </div>
      <p style={{ fontSize: 12, opacity: 0.6, margin: "10px 2px" }}>周囲の用語をタップすると中心が移ります。二重丸は修得済み、⚠は忘れかけ。</p>
      <div style={{ background: "#FBFBF8", borderRadius: 16, boxShadow: "0 2px 10px #0002", padding: 6 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {nodes.map(nd => <line key={"l" + nd.n} x1={cx} y1={cy} x2={nd.x} y2={nd.y} stroke={INDIGO} strokeWidth="1.2" strokeDasharray="3 4" opacity="0.5" />)}
          {nodes.map(nd => {
            const mm = getM(mastery, nd.n);
            const fc = FIELD_COLOR[CATF[byName[nd.n].c]];
            const fg = isForgotten(mastery, nd.n);
            return (
              <g key={nd.n} onClick={() => recenter(nd.n)} style={{ cursor: "pointer" }}>
                <circle cx={nd.x} cy={nd.y} r="30" fill="#fff" stroke={fg ? SHU : fc} strokeWidth={fg ? 2.5 : 2} />
                {mm.v >= 3 && <circle cx={nd.x} cy={nd.y} r="34" fill="none" stroke={GOLD} strokeWidth="1.5" />}
                <text x={nd.x} y={nd.y} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill={INK} fontWeight="700">
                  {nd.n.length > 7 ? <>
                    <tspan x={nd.x} dy="-5">{nd.n.slice(0, 6)}</tspan>
                    <tspan x={nd.x} dy="11">{nd.n.slice(6, 13)}</tspan>
                  </> : nd.n}
                </text>
                {fg && <text x={nd.x + 22} y={nd.y - 22} fontSize="11">⚠</text>}
              </g>
            );
          })}
          <g onClick={() => onOpen(c.n)} style={{ cursor: "pointer" }}>
            <circle cx={cx} cy={cy} r="46" fill={FIELD_COLOR[CATF[c.c]]} />
            {getM(mastery, c.n).v >= 3 && <circle cx={cx} cy={cy} r="51" fill="none" stroke={GOLD} strokeWidth="2" />}
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="11.5" fill="#fff" fontWeight="800">
              {c.n.length > 8 ? <>
                <tspan x={cx} dy="-6">{c.n.slice(0, 7)}</tspan>
                <tspan x={cx} dy="13">{c.n.slice(7, 15)}</tspan>
              </> : c.n}
            </text>
          </g>
        </svg>
      </div>
      <button onClick={() => onOpen(c.n)} style={{ width: "100%", textAlign: "left", background: "#fff", border: "none", borderRadius: 12, padding: "14px 16px", marginTop: 12, boxShadow: "0 1px 3px #0001" }}>
        <div style={{ fontSize: 11, color: FIELD_COLOR[CATF[c.c]], fontWeight: 700 }}>{c.c}　<span style={{ opacity: 0.5, color: INK }}>タップで詳細へ</span></div>
        <p style={{ fontSize: 14, lineHeight: 1.8, margin: "6px 0 0", color: INK }}>{c.d}</p>
      </button>
    </div>
  );
}
