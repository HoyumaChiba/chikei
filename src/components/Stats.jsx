import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";
import { MasteryDots, FieldTabs } from "./common.jsx";

export default function Stats({ mastery, xp, streak }) {
  const total = TERMS.length;
  const learned = TERMS.filter(t => getM(mastery, t.n).v >= 1).length;
  const mastered = TERMS.filter(t => getM(mastery, t.n).v >= 3).length;
  const forgot = TERMS.filter(t => isForgotten(mastery, t.n)).length;
  const perField = Object.keys(FIELDS).map(f => {
    const list = TERMS.filter(t => CATF[t.c] === f);
    return { f, done: list.filter(t => getM(mastery, t.n).v >= 3).length, total: list.length };
  });
  return (
    <div className="fadein">
      <div style={{ background: INK, color: "#F5F2E9", borderRadius: 16, padding: "22px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.25em", opacity: 0.7 }}>現在の段位</div>
        <div className="serif" style={{ fontSize: 38, fontWeight: 800, margin: "6px 0 10px", color: "#EAD9A8" }}>{rankOf(xp)}</div>
        <div style={{ height: 8, background: "#ffffff22", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${rankProg(xp) * 100}%`, height: "100%", background: GOLD, transition: "width .4s" }} />
        </div>
        <div style={{ fontSize: 12, marginTop: 8, opacity: 0.75 }}>{xp} XP ・ 次の段位まであと {200 - (xp % 200)} XP</div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {[["🔥 連続学習", `${streak}日`], ["✅ 触れた用語", `${learned}/${total}`], ["🏅 修得済み", `${mastered}語`], ["⚠ 忘れかけ", `${forgot}語`]].map(([lb, v]) => (
          <div key={lb} style={{ flex: 1, background: "#FBFBF8", borderRadius: 12, padding: "14px 4px", textAlign: "center", boxShadow: "0 1px 3px #0001" }}>
            <div style={{ fontSize: 10.5, opacity: 0.65 }}>{lb}</div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 800, color: lb.includes("忘れ") ? SHU : INDIGO, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#FBFBF8", borderRadius: 12, padding: "16px", marginTop: 12, boxShadow: "0 1px 3px #0001" }}>
        <div className="serif" style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>分野別の修得状況</div>
        {perField.map(({ f, done, total }) => (
          <div key={f} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: FIELD_COLOR[f] }}>{FIELDS[f]}</span>
              <span style={{ opacity: 0.65 }}>{done}/{total}</span>
            </div>
            <div style={{ height: 8, background: "#0000000d", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${total ? (done / total) * 100 : 0}%`, height: "100%", background: FIELD_COLOR[f], transition: "width .4s" }} />
            </div>
          </div>
        ))}
        <p style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.7, margin: "6px 0 0" }}>「修得」は★3。一度★2以上に達した用語が下がると「忘れかけ」として辞典・赤シートで優先されます。</p>
      </div>
    </div>
  );
}
