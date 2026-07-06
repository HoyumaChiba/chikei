// 用語データの統合と共通ヘルパ
import { TERMS_T } from "../data/terms-technology.js";
import { TERMS_M } from "../data/terms-management.js";
import { TERMS_S } from "../data/terms-strategy.js";
import { EXTRA } from "../data/terms-extra.js";

export const FIELDS = { T: "テクノロジ系", M: "マネジメント系", S: "ストラテジ系" };
export const FIELD_COLOR = { T: "#2C5F8A", M: "#3E7C59", S: "#8A5A2C" };
export const CATS = [
  ["基礎理論", "T"], ["アルゴリズム", "T"], ["コンピュータ構成要素", "T"], ["システム構成要素", "T"],
  ["ソフトウェア・ハードウェア", "T"], ["データベース", "T"], ["ネットワーク", "T"], ["セキュリティ", "T"], ["開発技術", "T"],
  ["プロジェクトマネジメント", "M"], ["サービスマネジメント・監査", "M"],
  ["システム戦略", "S"], ["経営戦略", "S"], ["企業と法務", "S"],
];
export const CATF = Object.fromEntries(CATS.map(([c, f]) => [c, f]));

export const TERMS = [...TERMS_T, ...TERMS_M, ...TERMS_S];
// 追加情報(計算例 calc / 午後の視点 pm)をマージ
TERMS.forEach(t => { const e = EXTRA[t.n]; if (e) Object.assign(t, e); });
export const PM_TERMS = TERMS.filter(t => t.pm);

export const byName = Object.fromEntries(TERMS.map(t => [t.n, t]));
TERMS.forEach(t => { t.r = (t.r || []).filter(x => byName[x]); });
// 双方向リンク化
const LINKS = {};
TERMS.forEach(t => { LINKS[t.n] = new Set(t.r); });
TERMS.forEach(t => t.r.forEach(r => LINKS[r].add(t.n)));
export const relsOf = n => [...(LINKS[n] || [])];
export const idxOf = Object.fromEntries(TERMS.map((t, i) => [t.n, i]));

export const RANKS = ["入門", "初段", "二段", "三段", "四段", "五段", "六段", "七段", "免許皆伝"];
export const rankOf = xp => RANKS[Math.min(RANKS.length - 1, Math.floor(xp / 200))];
export const rankProg = xp => (xp % 200) / 200;

export const INK = "#1C2B3A", INDIGO = "#234E70", SHU = "#C73E3A", PAPER = "#EEF1EF", GOLD = "#B98A2F";
export const todayStr = () => new Date().toISOString().slice(0, 10);

export const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// 習熟度: {v: 現在値0-3, b: 過去最高値}。旧形式(数値のみ)からも読めるようにする
export const getM = (m, n) => { const e = m[n]; if (e == null) return { v: 0, b: 0 }; if (typeof e === "number") return { v: e, b: e }; return e; };
export const isForgotten = (m, n) => { const e = getM(m, n); return e.b >= 2 && e.v < e.b; };

// 学習回数: {sd: 赤シート出題, sc: 赤シート正解, qd: 演習出題, qc: 演習正解}
export const getC = (counts, n) => ({ sd: 0, sc: 0, qd: 0, qc: 0, ...(counts?.[n] || {}) });
