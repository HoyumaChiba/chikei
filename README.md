# 知繋 -chikei- 応用情報技術者試験 用語学習アプリ

全193語(全14分野)を「一文定義 → 詳解 → 試験のツボ」の3層で収録した学習アプリ。
時録 -jiroku- と同じ構成(React + Vite + Firebase + Netlify)。

## 機能
- 📖 辞典: 分野別/検索/「忘れかけだけ表示」。詳細は全画面で前後の用語に順送り可
- 🟥 赤シート: 説明→めくって答え合わせ。忘れかけ→習熟の浅い順に出題
- ✍️ 演習: 4択(同分野の紛らわしい選択肢入り)。回答後に試験のツボを表示
- 🕸 相関: 用語の繋がりを放射状マップで歩ける。← 戻る で履歴を遡れる
- 📜 記録: XP段位・連続日数・分野別修得率・忘れかけ数
- 進捗は localStorage に即時保存し、Firestore(匿名Auth)へ自動同期

## ディレクトリ構成
```
src/
  data/            用語データ(分野別に分割。用語の追加・修正はここだけ)
    terms-technology.js   テクノロジ系 134語
    terms-management.js   マネジメント系 19語
    terms-strategy.js     ストラテジ系 40語
  lib/
    terms.js       データ統合・定数・共通ヘルパ(習熟度計算など)
    firebase.js    Firebase初期化と匿名ログイン
  hooks/
    useProgress.js 進捗の読み書き(localStorage + Firestore同期)
  components/      画面ごとのコンポーネント
    Dictionary / TermDetail / RedSheet / Quiz / Graph / Stats / common
  App.jsx          タブ切替・画面遷移履歴・学習イベント
```

## セットアップ
```bash
npm install
cp .env.example .env   # Firebaseの設定値を記入
npm run dev
```

### Firebase側の準備(時録と同様)
1. Firebaseコンソールで新規プロジェクト(または時録と同じプロジェクトに同居も可)
2. Authentication → ログイン方法 → **匿名** を有効化
3. Firestore Database を作成し、`firestore.rules` の内容をルールに貼り付け
4. プロジェクトの設定 → マイアプリ(Web)を追加し、構成値を `.env` へ

進捗データは `chikei_progress/{uid}` に1ドキュメントで保存されます。
時録と同じプロジェクトに同居させる場合は、既存ルールにこのmatchブロックを追記してください。

## Netlifyデプロイ
1. GitHubにpushしてNetlifyでリポジトリを連携(`netlify.toml` が build 設定を持っています)
2. Site settings → Environment variables に `.env` と同じ6つの `VITE_FB_*` を登録
3. デプロイ後、Firebaseコンソール → Authentication → 設定 → 承認済みドメイン に
   Netlifyのドメイン(xxx.netlify.app)を追加

## 用語の追加方法
`src/data/terms-*.js` に以下の形式でオブジェクトを足すだけです(関連 `r` は既存の用語名を指定):
```js
{n:"用語名", c:"分類名",
d:"一文定義。",
x:"仕組みの詳解。",
p:"試験のツボ。",
r:["関連用語1","関連用語2"]},
```
存在しない関連名は自動で無視され、リンクは自動的に双方向化されます。

## メモ
- 進捗の競合解決は「XPが大きい方を採用」の単純方式(1人利用前提)
- 端末を替えても匿名UIDが変わると進捗は引き継がれません。
  引き継ぎたくなったらGoogleログインへのアップグレード(linkWithCredential)が次の一手です
