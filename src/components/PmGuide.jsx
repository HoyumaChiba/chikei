import React, { useState } from "react";
import { PM_TERMS, CATS, CATF, FIELD_COLOR, getM, getC, isForgotten, INK, INDIGO, SHU, GOLD } from "../lib/terms.js";
import { MasteryDots } from "./common.jsx";

// 午後試験の出題構成と選択戦略
const PM_QUESTIONS = [
  { no: "問1", name: "情報セキュリティ", must: true, note: "全員必須。用語+ネットワーク構成図の読解。配点も学習効率も高い" },
  { no: "問2", name: "経営戦略", note: "国語力で戦える。財務・マーケの基本用語(損益分岐点・SWOT)があれば安定" },
  { no: "問3", name: "プログラミング", note: "擬似言語のトレース。得意なら高得点、未経験なら避けるのが無難" },
  { no: "問4", name: "システムアーキテクチャ", note: "稼働率・キャッシュ・待ち行列など計算中心。パターンが決まっていて対策しやすい" },
  { no: "問5", name: "ネットワーク", note: "IPアドレス計算・DNS・NAPT。構成図を落ち着いて読めれば得点源" },
  { no: "問6", name: "データベース", note: "SQL穴埋め+正規化+E-R図。出題パターンが最も安定している分野の一つ" },
  { no: "問7", name: "組込みシステム開発", note: "問題文が素直で国語で解ける回が多い。理系的な読解が苦でなければ狙い目" },
  { no: "問8", name: "情報システム開発", note: "テスト設計・UML・アジャイル。開発経験があれば読みやすい" },
  { no: "問9", name: "プロジェクトマネジメント", note: "EVM・クリティカルパスの計算+事例読解。実務経験者に有利" },
  { no: "問10", name: "サービスマネジメント", note: "SLA・インシデント管理。事例の読解中心で暗記負担は軽い" },
  { no: "問11", name: "システム監査", note: "「監査人の立場なら何を指摘するか」の国語問題。文系寄りの人の定番選択" },
];

const TIPS = [
  ["選択は「事前に」決めておく", "本番で問題を見てから選ぶと時間を失う。予備1問を含めた5〜6分野に絞って演習しておき、当日は中身を見て最終決定する。"],
  ["設問文の指定に従って書く", "「30字以内で」「本文中の用語を用いて」などの指定が採点基準そのもの。問われ方(理由か・対策か・名称か)に正面から答える。"],
  ["答えは問題文の中にある", "午後は知識試験ではなく読解試験。解答の根拠となる一文が本文に必ずあるので、設問→本文該当箇所の往復で解く。"],
  ["計算問題は途中式を書く", "稼働率・EVM・損益分岐点などの計算はパターンが決まっている。この辞典の「計算例」を手で再現できれば本番も同じ形で出る。"],
  ["時間配分は1問30分未満", "150分で5問。1問に固執せず、詰まったら次の設問へ。空欄はつくらない(部分点がある)。"],
];

export default function PmGuide({ mastery, counts, onOpen }) {
  const [openSec, setOpenSec] = useState("q");
  const cats = CATS.filter(([c]) => PM_TERMS.some(t => t.c === c));

  const Sec = ({ id, title, children }) => (
    <div style={{ marginBottom: 10, background: "#FBFBF8", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px #0001" }}>
      <button onClick={() => setOpenSec(openSec === id ? null : id)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "none", border: "none", borderLeft: `4px solid ${SHU}` }}>
        <span className="serif" style={{ fontSize: 15, fontWeight: 700, color: INK }}>{title}</span>
        <span style={{ fontSize: 12, color: "#0007" }}>{openSec === id ? "▴" : "▾"}</span>
      </button>
      {openSec === id && <div style={{ padding: "0 14px 14px" }}>{children}</div>}
    </div>
  );

  return (
    <div className="fadein">
      <div style={{ background: INDIGO, color: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div className="serif" style={{ fontSize: 16, fontWeight: 700 }}>🎯 午後試験対策</div>
        <p style={{ fontSize: 12.5, lineHeight: 1.8, margin: "6px 0 0", opacity: 0.9 }}>
          記述式・150分。問1(情報セキュリティ)が必須、問2〜11から4問を選択して計5問に解答する。
          午前の用語知識を「事例の文章で使える」形にするのが対策の軸。
        </p>
      </div>

      <Sec id="q" title="出題分野と選び方">
        {PM_QUESTIONS.map(q => (
          <div key={q.no} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${INK}11`, alignItems: "baseline" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: q.must ? "#fff" : SHU, background: q.must ? SHU : "transparent", border: q.must ? "none" : `1px solid ${SHU}66`, borderRadius: 6, padding: "2px 7px", whiteSpace: "nowrap" }}>{q.no}{q.must ? "必須" : ""}</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{q.name}</div>
              <div style={{ fontSize: 12, color: "#0008", lineHeight: 1.7 }}>{q.note}</div>
            </div>
          </div>
        ))}
      </Sec>

      <Sec id="t" title="解き方の鉄則">
        {TIPS.map(([h, b]) => (
          <div key={h} style={{ padding: "8px 0", borderBottom: `1px solid ${INK}11` }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: INDIGO }}>{h}</div>
            <div style={{ fontSize: 12.5, color: "#000a", lineHeight: 1.8, marginTop: 2 }}>{b}</div>
          </div>
        ))}
      </Sec>

      <div className="serif" style={{ fontSize: 15, fontWeight: 700, margin: "16px 0 8px", color: INK }}>
        午後頻出の用語({PM_TERMS.length}語)
      </div>
      <p style={{ fontSize: 12, color: "#0008", margin: "0 0 10px", lineHeight: 1.7 }}>
        各用語の「🎯 午後の視点」に、記述式でどう問われるか・解答の型をまとめてある。タップで確認。
      </p>
      {cats.map(([cat, f]) => {
        const list = PM_TERMS.filter(t => t.c === cat);
        return (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: FIELD_COLOR[f], margin: "0 0 6px" }}>{cat}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {list.map(t => {
                const m = getM(mastery, t.n);
                const c = getC(counts, t.n);
                const touched = c.sd + c.qd;
                return (
                  <button key={t.n} onClick={() => onOpen(t.n)}
                    style={{ border: isForgotten(mastery, t.n) ? `1.5px solid ${SHU}` : `1.5px solid ${INDIGO}44`, background: m.v >= 3 ? "#EAF3EC" : "#fff", color: INK, borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 600 }}>
                    {t.n}{touched > 0 && <span style={{ fontSize: 10, color: "#0007" }}> ·{touched}回</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
