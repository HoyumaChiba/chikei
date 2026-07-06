import React, { useState, useEffect, useMemo, useRef } from "react";
import { TERMS, FIELDS, FIELD_COLOR, CATS, CATF, byName, relsOf, idxOf, getM, isForgotten, shuffle, INK, INDIGO, SHU, GOLD, rankOf, rankProg } from "../lib/terms.js";

export function MasteryDots({ v }) {
  return (
    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: i < v ? GOLD : "#0002", display: "inline-block" }} />
      ))}
    </div>
  );
}

export function FieldTabs({ field, setField }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
      {[["ALL", "全分野"], ["T", "テクノロジ"], ["M", "マネジメント"], ["S", "ストラテジ"]].map(([k, lb]) => (
        <button key={k} onClick={() => setField(k)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", background: field === k ? (k === "ALL" ? INK : FIELD_COLOR[k]) : "#fff", color: field === k ? "#fff" : INK, boxShadow: "0 1px 2px #0001" }}>{lb}</button>
      ))}
    </div>
  );
}
