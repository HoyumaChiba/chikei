// 用語ごとのSVG図解。FIGS[用語名] があれば詳細画面に表示される
import React from "react";
import { INK, INDIGO, SHU, GOLD } from "../lib/terms.js";

const GREEN = "#3E7C59";
const S = { width: "100%", height: "auto", display: "block" };
const box = { fill: "#fff", stroke: INDIGO, strokeWidth: 1.5, rx: 6 };
const t = (x, y, s, opt = {}) => (
  <text x={x} y={y} fontSize={opt.fs || 11} fill={opt.c || INK} fontWeight={opt.w || 500}
    textAnchor={opt.a || "middle"} fontFamily="sans-serif">{s}</text>
);
const arrow = (x1, y1, x2, y2, c = INK) => (
  <g stroke={c} strokeWidth={1.5} fill={c}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <ArrowHead x={x2} y={y2} from={[x1, y1]} c={c} />
  </g>
);
function ArrowHead({ x, y, from, c }) {
  const ang = Math.atan2(y - from[1], x - from[0]);
  const p = a => `${x - 8 * Math.cos(ang - a)},${y - 8 * Math.sin(ang - a)}`;
  return <polygon points={`${x},${y} ${p(0.4)} ${p(-0.4)}`} stroke="none" fill={c} />;
}

export const FIGS = {
  "公開鍵暗号方式": (
    <svg viewBox="0 0 340 150" style={S} xmlns="http://www.w3.org/2000/svg">
      <rect x={10} y={55} width={70} height={40} {...box} />
      {t(45, 73, "送信者A")}{t(45, 88, "平文", { fs: 10, c: "#0008" })}
      <rect x={135} y={55} width={70} height={40} {...box} />
      {t(170, 73, "暗号文")}{t(170, 88, "🔒", { fs: 12 })}
      <rect x={260} y={55} width={70} height={40} {...box} />
      {t(295, 73, "受信者B")}{t(295, 88, "平文", { fs: 10, c: "#0008" })}
      {arrow(80, 75, 133, 75, INDIGO)}
      {arrow(205, 75, 258, 75, GREEN)}
      {t(107, 45, "Bの公開鍵で", { fs: 10, c: INDIGO, w: 700 })}
      {t(107, 57, "暗号化", { fs: 10, c: INDIGO, w: 700 })}
      {t(232, 45, "Bの秘密鍵で", { fs: 10, c: GREEN, w: 700 })}
      {t(232, 57, "復号", { fs: 10, c: GREEN, w: 700 })}
      {t(170, 125, "公開鍵は誰に配ってもよい。復号できるのは", { fs: 10.5, c: "#0009" })}
      {t(170, 140, "秘密鍵を持つ受信者Bだけ(鍵配送問題の解決)", { fs: 10.5, c: "#0009" })}
    </svg>
  ),

  "デジタル署名": (
    <svg viewBox="0 0 340 190" style={S} xmlns="http://www.w3.org/2000/svg">
      {t(80, 18, "― 送信者 ―", { fs: 11, c: INDIGO, w: 700 })}
      <rect x={30} y={28} width={100} height={26} {...box} />
      {t(80, 45, "文書")}
      {arrow(80, 54, 80, 76)}
      {t(115, 68, "ハッシュ化", { fs: 9.5, c: "#0008", a: "start" })}
      <rect x={30} y={78} width={100} height={26} {...box} />
      {t(80, 95, "ハッシュ値")}
      {arrow(80, 104, 80, 126, SHU)}
      {t(115, 118, "秘密鍵で暗号化", { fs: 9.5, c: SHU, a: "start" })}
      <rect x={30} y={128} width={100} height={26} fill="#F8ECEB" stroke={SHU} strokeWidth={1.5} rx={6} />
      {t(80, 145, "署名", { c: SHU, w: 700 })}
      {t(260, 18, "― 受信者 ―", { fs: 11, c: GREEN, w: 700 })}
      <rect x={210} y={28} width={100} height={26} {...box} />
      {t(260, 45, "届いた文書")}
      {arrow(260, 54, 260, 76)}
      <rect x={210} y={78} width={100} height={26} {...box} />
      {t(260, 95, "ハッシュ値")}
      <rect x={210} y={128} width={100} height={26} {...box} />
      {t(260, 145, "署名を公開鍵で復号")}
      {arrow(260, 126, 260, 106, GREEN)}
      {arrow(133, 141, 208, 141, SHU)}
      {t(170, 178, "2つのハッシュ値が一致 → 改ざんなし+本人が作成", { fs: 10.5, c: "#0009" })}
    </svg>
  ),

  "TLS": (
    <svg viewBox="0 0 340 190" style={S} xmlns="http://www.w3.org/2000/svg">
      {t(60, 16, "クライアント", { w: 700, c: INDIGO })}
      {t(280, 16, "サーバ", { w: 700, c: INDIGO })}
      <line x1={60} y1={24} x2={60} y2={165} stroke={`${INK}44`} strokeWidth={1.5} />
      <line x1={280} y1={24} x2={280} y2={165} stroke={`${INK}44`} strokeWidth={1.5} />
      {arrow(65, 40, 275, 40, INK)}
      {t(170, 34, "① 接続要求(対応方式の提示)", { fs: 10 })}
      {arrow(275, 68, 65, 68, INK)}
      {t(170, 62, "② サーバ証明書(公開鍵入り)を送付", { fs: 10 })}
      {t(170, 84, "③ 証明書を検証 → 鍵材料を公開鍵で暗号化して送付", { fs: 10, c: SHU })}
      {arrow(65, 96, 275, 96, SHU)}
      {t(170, 116, "④ 双方で同じ共通鍵(セッション鍵)を生成", { fs: 10, c: GREEN })}
      <rect x={65} y={128} width={210} height={26} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
      {t(170, 145, "⑤ 以降は共通鍵で高速に暗号化通信", { fs: 10.5, c: GREEN, w: 700 })}
      {t(170, 180, "鍵交換は公開鍵暗号、本文は共通鍵暗号(ハイブリッド)", { fs: 10, c: "#0009" })}
    </svg>
  ),

  "DMZ": (
    <svg viewBox="0 0 340 160" style={S} xmlns="http://www.w3.org/2000/svg">
      <rect x={10} y={55} width={70} height={40} fill={`${SHU}11`} stroke={SHU} strokeWidth={1.5} rx={6} />
      {t(45, 73, "インター", { fs: 10.5 })}{t(45, 86, "ネット", { fs: 10.5 })}
      <rect x={95} y={50} width={16} height={50} fill={GOLD} rx={3} />
      {t(103, 118, "FW", { fs: 10, w: 700, c: GOLD })}
      <rect x={126} y={40} width={110} height={70} fill="#FDF6EC" stroke={GOLD} strokeWidth={1.5} rx={8} strokeDasharray="5 3" />
      {t(181, 30, "DMZ(緩衝地帯)", { fs: 11, w: 700, c: GOLD })}
      <rect x={136} y={52} width={90} height={20} {...box} />
      {t(181, 66, "Webサーバ", { fs: 10 })}
      <rect x={136} y={80} width={90} height={20} {...box} />
      {t(181, 94, "メールサーバ", { fs: 10 })}
      <rect x={251} y={50} width={16} height={50} fill={GOLD} rx={3} />
      {t(259, 118, "FW", { fs: 10, w: 700, c: GOLD })}
      <rect x={282} y={55} width={50} height={40} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
      {t(307, 73, "内部", { fs: 10.5, c: GREEN })}{t(307, 86, "LAN", { fs: 10.5, c: GREEN })}
      {t(170, 148, "公開サーバが乗っ取られても内部LANへは直接入れない", { fs: 10.5, c: "#0009" })}
    </svg>
  ),

  "OSI参照モデル": (
    <svg viewBox="0 0 340 210" style={S} xmlns="http://www.w3.org/2000/svg">
      {t(95, 16, "OSI 7階層", { w: 700, c: INDIGO })}
      {t(255, 16, "TCP/IP 4階層", { w: 700, c: GREEN })}
      {["応用層", "プレゼンテーション層", "セッション層", "トランスポート層", "ネットワーク層", "データリンク層", "物理層"].map((n, i) => (
        <g key={n}>
          <rect x={30} y={24 + i * 24} width={130} height={20} {...box} />
          {t(95, 38 + i * 24, `${7 - i}. ${n}`, { fs: 9.5 })}
        </g>
      ))}
      {[["アプリケーション層", 24, 68, "HTTP, DNS, SMTP"], ["トランスポート層", 96, 20, "TCP, UDP"], ["インターネット層", 120, 20, "IP"], ["ネットワークインタフェース層", 144, 44, "Ethernet"]].map(([n, y, h, ex]) => (
        <g key={n}>
          <rect x={195} y={y} width={135} height={h} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
          {t(262, y + h / 2 - 2, n, { fs: 9.5, c: "#2C5940", w: 700 })}
          {t(262, y + h / 2 + 10, ex, { fs: 8.5, c: "#2C594099" })}
        </g>
      ))}
      {t(170, 205, "「どの層のプロトコル・機器か」の対応づけが頻出", { fs: 10.5, c: "#0009" })}
    </svg>
  ),

  "NATとNAPT": (
    <svg viewBox="0 0 340 150" style={S} xmlns="http://www.w3.org/2000/svg">
      <rect x={10} y={30} width={95} height={54} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
      {t(57, 48, "社内PC", { fs: 10.5, c: "#2C5940", w: 700 })}
      {t(57, 63, "192.168.1.2", { fs: 9.5, c: "#2C5940" })}
      {t(57, 76, "ポート1234", { fs: 9.5, c: "#2C5940" })}
      <rect x={130} y={30} width={80} height={54} fill="#FDF6EC" stroke={GOLD} strokeWidth={1.5} rx={6} />
      {t(170, 48, "ルータ", { fs: 10.5, c: GOLD, w: 700 })}
      {t(170, 63, "NAPTで変換", { fs: 9.5, c: GOLD })}
      <rect x={235} y={30} width={95} height={54} {...box} />
      {t(282, 48, "インターネット", { fs: 10, w: 700 })}
      {t(282, 63, "203.0.113.1", { fs: 9.5, c: "#0008" })}
      {t(282, 76, "ポート50001", { fs: 9.5, c: "#0008" })}
      {arrow(105, 57, 128, 57, GREEN)}
      {arrow(210, 57, 233, 57, GOLD)}
      {t(170, 110, "(私有IP, ポート) ⇄ (グローバルIP, ポート) の対応表を持つので", { fs: 10, c: "#0009" })}
      {t(170, 125, "1つのグローバルIPを複数台で同時に共有できる", { fs: 10, c: "#0009" })}
    </svg>
  ),

  "RAID": (
    <svg viewBox="0 0 340 175" style={S} xmlns="http://www.w3.org/2000/svg">
      {t(60, 18, "RAID0", { w: 700, c: INDIGO })}
      {t(60, 31, "ストライピング", { fs: 9, c: "#0008" })}
      {[["A1", "A3"], ["A2", "A4"]].map((col, i) => (
        <g key={i}>
          <rect x={25 + i * 40} y={38} width={32} height={44} {...box} />
          {t(41 + i * 40, 54, col[0], { fs: 9.5 })}{t(41 + i * 40, 72, col[1], { fs: 9.5 })}
        </g>
      ))}
      {t(60, 100, "高速・冗長性なし", { fs: 9, c: SHU })}
      {t(170, 18, "RAID1", { w: 700, c: INDIGO })}
      {t(170, 31, "ミラーリング", { fs: 9, c: "#0008" })}
      {[0, 1].map(i => (
        <g key={i}>
          <rect x={135 + i * 40} y={38} width={32} height={44} {...box} />
          {t(151 + i * 40, 54, "A1", { fs: 9.5 })}{t(151 + i * 40, 72, "A2", { fs: 9.5 })}
        </g>
      ))}
      {t(170, 100, "同じ内容を複製", { fs: 9, c: GREEN })}
      {t(282, 18, "RAID5", { w: 700, c: INDIGO })}
      {t(282, 31, "パリティ分散", { fs: 9, c: "#0008" })}
      {[["A1", "B1"], ["A2", "P²"], ["P¹", "B2"]].map((col, i) => (
        <g key={i}>
          <rect x={230 + i * 36} y={38} width={30} height={44} {...box} />
          {t(245 + i * 36, 54, col[0], { fs: 9.5, c: col[0].startsWith("P") ? GOLD : INK, w: col[0].startsWith("P") ? 700 : 500 })}
          {t(245 + i * 36, 72, col[1], { fs: 9.5, c: col[1].startsWith("P") ? GOLD : INK, w: col[1].startsWith("P") ? 700 : 500 })}
        </g>
      ))}
      {t(282, 100, "1本故障まで復元可", { fs: 9, c: GREEN })}
      {t(170, 130, "P=パリティ。RAID5はn本中1本分の容量をパリティに使い、", { fs: 10, c: "#0009" })}
      {t(170, 145, "どの1本が壊れても残りから計算で復元できる", { fs: 10, c: "#0009" })}
      {t(170, 165, "RAID6はパリティ2重化で2本同時故障まで耐える", { fs: 10, c: "#0009" })}
    </svg>
  ),

  "稼働率": (
    <svg viewBox="0 0 340 165" style={S} xmlns="http://www.w3.org/2000/svg">
      {t(80, 18, "直列(どちらも動く必要)", { fs: 11, w: 700, c: SHU })}
      <rect x={25} y={30} width={50} height={26} {...box} />
      {t(50, 47, "0.9", { fs: 11 })}
      {arrow(75, 43, 90, 43)}
      <rect x={90} y={30} width={50} height={26} {...box} />
      {t(115, 47, "0.9", { fs: 11 })}
      {t(80, 78, "0.9 × 0.9 = 0.81", { fs: 12, w: 700, c: SHU })}
      {t(255, 18, "並列(片方動けばOK)", { fs: 11, w: 700, c: GREEN })}
      <rect x={230} y={26} width={50} height={22} {...box} />
      {t(255, 41, "0.9", { fs: 11 })}
      <rect x={230} y={54} width={50} height={22} {...box} />
      {t(255, 69, "0.9", { fs: 11 })}
      <line x1={205} y1={51} x2={228} y2={37} stroke={INK} strokeWidth={1.5} />
      <line x1={205} y1={51} x2={228} y2={65} stroke={INK} strokeWidth={1.5} />
      <line x1={280} y1={37} x2={303} y2={51} stroke={INK} strokeWidth={1.5} />
      <line x1={280} y1={65} x2={303} y2={51} stroke={INK} strokeWidth={1.5} />
      {t(255, 98, "1−(1−0.9)² = 0.99", { fs: 12, w: 700, c: GREEN })}
      {t(170, 130, "直列は掛けるだけ。並列は「全部壊れる確率」を1から引く。", { fs: 10.5, c: "#0009" })}
      {t(170, 145, "混在した構成は内側のまとまりから順に1つの箱に潰していく", { fs: 10.5, c: "#0009" })}
    </svg>
  ),

  "キャッシュメモリ": (
    <svg viewBox="0 0 340 150" style={S} xmlns="http://www.w3.org/2000/svg">
      <rect x={15} y={45} width={70} height={40} fill={INDIGO} rx={6} />
      {t(50, 63, "CPU", { c: "#fff", w: 700 })}{t(50, 77, "高速", { fs: 9, c: "#fffa" })}
      <rect x={135} y={45} width={80} height={40} fill="#FDF6EC" stroke={GOLD} strokeWidth={1.5} rx={6} />
      {t(175, 60, "キャッシュ", { fs: 10.5, c: GOLD, w: 700 })}
      {t(175, 75, "10ns", { fs: 10, c: GOLD })}
      <rect x={265} y={45} width={65} height={40} {...box} />
      {t(297, 60, "主記憶", { fs: 10.5 })}
      {t(297, 75, "100ns", { fs: 10, c: "#0008" })}
      {arrow(85, 58, 133, 58, GREEN)}
      {t(109, 50, "ヒット95%", { fs: 9, c: GREEN, w: 700 })}
      {arrow(215, 72, 263, 72, SHU)}
      {t(239, 95, "ミス5%", { fs: 9, c: SHU, w: 700 })}
      {t(170, 122, "実効アクセス時間 = 0.95×10 + 0.05×100 = 14.5ns", { fs: 11, w: 700, c: INDIGO })}
      {t(170, 140, "よく使うデータを速い場所に置く、が階層記憶の基本発想", { fs: 10, c: "#0009" })}
    </svg>
  ),

  "正規化": (
    <svg viewBox="0 0 340 175" style={S} xmlns="http://www.w3.org/2000/svg">
      <rect x={15} y={25} width={140} height={56} fill="#F8ECEB" stroke={SHU} strokeWidth={1.5} rx={6} />
      {t(85, 18, "正規化前(冗長)", { fs: 10.5, w: 700, c: SHU })}
      {t(85, 43, "注文ID｜顧客名｜商品名｜単価", { fs: 8.5 })}
      {t(85, 58, "1001｜佐藤｜りんご｜100", { fs: 8.5, c: "#0008" })}
      {t(85, 71, "1002｜佐藤｜みかん｜80", { fs: 8.5, c: "#0008" })}
      {arrow(160, 53, 190, 53, INDIGO)}
      {t(175, 43, "分解", { fs: 9.5, c: INDIGO, w: 700 })}
      <rect x={195} y={12} width={130} height={38} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
      {t(260, 27, "注文(注文ID, 顧客ID, 商品ID)", { fs: 8.5, c: "#2C5940" })}
      {t(260, 41, "←事実は1か所にだけ書く", { fs: 8, c: "#2C594099" })}
      <rect x={195} y={56} width={130} height={24} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
      {t(260, 71, "顧客(顧客ID, 顧客名)", { fs: 8.5, c: "#2C5940" })}
      <rect x={195} y={86} width={130} height={24} fill="#EAF3EC" stroke={GREEN} strokeWidth={1.5} rx={6} />
      {t(260, 101, "商品(商品ID, 商品名, 単価)", { fs: 8.5, c: "#2C5940" })}
      {t(170, 133, "「顧客名の変更が1行の更新で済む」= 更新時異状の防止。", { fs: 10, c: "#0009" })}
      {t(170, 148, "1NF: 繰返し排除 → 2NF: 部分関数従属排除", { fs: 10, c: "#0009" })}
      {t(170, 163, "→ 3NF: 推移的関数従属排除", { fs: 10, c: "#0009" })}
    </svg>
  ),

  "クリティカルパス": (
    <svg viewBox="0 0 340 150" style={S} xmlns="http://www.w3.org/2000/svg">
      {[[30, 70, "開始"], [120, 30, "B 5日"], [120, 110, "C 2日"], [230, 70, "D 4日"], [310, 70, "完了"]].map(([x, y, n], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 0 || i === 4 ? 16 : 20} fill={[1, 3].includes(i) ? "#F8ECEB" : "#fff"} stroke={[1, 3].includes(i) ? SHU : INK} strokeWidth={1.5} />
          {t(x, y + 4, n, { fs: 9, w: 700, c: [1, 3].includes(i) ? SHU : INK })}
        </g>
      ))}
      <g>
        {arrow(44, 61, 100, 38, SHU)}
        {t(62, 38, "A 3日", { fs: 9, c: SHU, w: 700 })}
        {arrow(140, 38, 212, 62, SHU)}
        {arrow(44, 79, 100, 102, INK)}
        {arrow(140, 102, 212, 78, INK)}
        {arrow(246, 70, 294, 70, SHU)}
      </g>
      {t(170, 143, "最長経路 A→B→D=12日 が全体所要日数。C側には3日の余裕", { fs: 10.5, c: "#0009" })}
    </svg>
  ),

  "損益分岐点": (
    <svg viewBox="0 0 340 175" style={S} xmlns="http://www.w3.org/2000/svg">
      <line x1={40} y1={140} x2={320} y2={140} stroke={INK} strokeWidth={1.5} />
      <line x1={40} y1={140} x2={40} y2={15} stroke={INK} strokeWidth={1.5} />
      {t(320, 155, "販売量", { fs: 9.5, a: "end" })}
      {t(38, 12, "金額", { fs: 9.5, a: "end" })}
      <line x1={40} y1={100} x2={310} y2={100} stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 3" />
      {t(75, 94, "固定費", { fs: 9.5, c: GOLD, w: 700 })}
      <line x1={40} y1={100} x2={310} y2={40} stroke={SHU} strokeWidth={2} />
      {t(280, 34, "総費用", { fs: 9.5, c: SHU, w: 700 })}
      <line x1={40} y1={140} x2={310} y2={20} stroke={GREEN} strokeWidth={2} />
      {t(310, 14, "売上高", { fs: 9.5, c: GREEN, w: 700 })}
      <circle cx={175} cy={80} r={5} fill={INDIGO} />
      {t(175, 66, "損益分岐点", { fs: 10, c: INDIGO, w: 700 })}
      <line x1={175} y1={85} x2={175} y2={140} stroke={`${INDIGO}66`} strokeWidth={1} strokeDasharray="3 3" />
      {t(230, 120, "利益", { fs: 9.5, c: GREEN, w: 700 })}
      {t(105, 120, "損失", { fs: 9.5, c: SHU, w: 700 })}
      {t(170, 170, "売上線と総費用線の交点。BEP売上高 = 固定費 ÷ (1−変動費率)", { fs: 10, c: "#0009" })}
    </svg>
  ),
};
