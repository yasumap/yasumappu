# 🗺️ Yasumappu（座れる場所を探せるマップアプリ）

座れる場所を探せるマップWebアプリケーションです。

## 📚 技術スタック

- **Frontend**: Next.js 16.1.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma v7
- **Auth**: Supabase Auth

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/yasumap/yasumappu.git
cd yasumappu
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、必要な値を設定してください。

```bash
cp .env.example .env
```

`.env`ファイルを編集して、以下の値を設定:
- Supabase URL
- Supabase API Key
- Database URL
- その他の環境変数

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
npm run prisma:generate

# マイグレーションの実行
npm run prisma:migrate
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いて確認してください。

## 📁 ディレクトリ構成

### プロジェクト全体の構造

```
yasumappu/
├── src/                    # ソースコード（メインの開発フォルダ）
│   ├── app/               # ページとAPIの定義
│   ├── components/        # 再利用可能なUI部品
│   ├── hooks/             # ロジックの共通化
│   ├── lib/               # 便利な関数とツール
│   ├── types/             # データの型定義
│   └── styles/            # デザイン関連
├── prisma/                # データベース設定
│   ├── schema.prisma     # データベース構造の定義
│   └── migrations/        # データベース変更履歴
├── public/                # 画像などの静的ファイル
├── .github/               # GitHub設定（CI/CDなど）
├── .env                   # 環境変数（秘密情報、gitに含めない）
├── .env.example           # 環境変数のテンプレート
├── package.json           # プロジェクト情報と依存関係
└── 設定ファイル群         # TypeScript、ESLintなどの設定
```

### src/フォルダの詳細

#### 📄 `app/` - ページとAPI
**役割**: URLに対応するページとAPIエンドポイントを定義する場所

```
app/
├── page.tsx              # トップページ（/ にアクセスした時）
├── layout.tsx            # 全ページ共通のレイアウト
└── api/                  # バックエンドAPI
    └── seats/            # 例: /api/seats のエンドポイント
```

**具体例**:
- `app/page.tsx` → `http://localhost:3000/` のページ
- `app/map/page.tsx` → `http://localhost:3000/map` のページ
- `app/api/seats/route.ts` → `http://localhost:3000/api/seats` のAPI

#### 🧩 `components/` - UIコンポーネント（部品）
**役割**: 繰り返し使う画面の部品を保管する場所

```
components/
├── map/                  # マップ関連のコンポーネント
│   ├── MapContainer.tsx # マップ本体
│   └── SeatMarker.tsx   # 座席のマーカー
├── places/               # 場所関連のコンポーネント
│   ├── PlaceCard.tsx    # 場所のカード表示
│   └── PlaceList.tsx    # 場所の一覧
├── layout/               # レイアウトコンポーネント
│   ├── Header.tsx       # ヘッダー
│   └── Footer.tsx       # フッター
└── ui/                   # 汎用的なUI部品
    ├── Button.tsx       # ボタン
    └── Modal.tsx        # モーダルウィンドウ
```

#### 🎣 `hooks/` - カスタムフック（ロジックの共通化）
**役割**: 複数のコンポーネントで使う処理をまとめる場所

```
hooks/
├── useMapStore.ts        # マップの状態管理
├── useGeolocation.ts     # 現在地取得
└── usePlaces.ts          # 場所データの取得
```

**フックとは？**
- `useState`, `useEffect`などのReactの機能を使った処理
- 複数のコンポーネントで同じロジックを使い回せる

**具体例**:
```typescript
// hooks/useGeolocation.ts
export function useGeolocation() {
  // 現在地を取得する処理
  return { latitude, longitude };
}

// どこでも使える
import { useGeolocation } from '@/hooks/useGeolocation';
```

#### 🛠️ `lib/` - ユーティリティ（便利な関数とツール）
**役割**: データベース接続や共通の便利関数を保管する場所

```
lib/
├── prisma.ts             # データベース接続の設定
├── supabase.ts           # Supabase接続の設定
└── utils.ts              # 便利な関数
```

**ユーティリティとは？**
- プロジェクト全体で使う便利な関数
- データベースやAPIとの接続設定

**具体例**:
```typescript
// lib/utils.ts
export function formatDate(date: Date) {
  // 日付を見やすくフォーマット
  return '2025年12月26日';
}
```

#### 📐 `types/` - TypeScript型定義
**役割**: データの「形」を定義する場所

```
types/
├── index.ts              # 型定義のまとめ
├── map.ts                # マップ関連の型
├── place.ts              # 場所関連の型
├── seat.ts               # 座席関連の型
└── user.ts               # ユーザー関連の型
```

**型定義とは？**
- データの構造を明確にする
- タイプミスやバグを防ぐ

**具体例**:
```typescript
// types/place.ts
export interface Place {
  id: string;           // ID（文字列）
  name: string;         // 場所の名前
  availableSeats: number; // 空席数（数値）
}

// 使用例
const cafe: Place = {
  id: '1',
  name: 'スタバ',
  availableSeats: 5
};
```

#### 🎨 `styles/` - スタイル（デザイン）
**役割**: 全体で共通のデザイン設定を保管する場所

```
styles/
└── globals.css           # 全体に適用するCSS
```

---

### 📦 ファイルを置く場所の判断基準

| 作るもの | 置く場所 | 例 |
|---------|---------|-----|
| 新しいページ | `app/` | トップページ、マップページ |
| 画面の部品（何度も使う） | `components/` | ボタン、ヘッダー、カード |
| データ取得のロジック | `hooks/` | 現在地取得、API呼び出し |
| 便利な関数 | `lib/` | 日付フォーマット、計算処理 |
| データの形の定義 | `types/` | Place型、User型 |
| 画像やアイコン | `public/` | ロゴ、マーカーアイコン |

---

### 💡 開発初心者向けヒント

1. **迷ったらチームに相談**
   - どこにファイルを置くか迷ったら聞く

2. **既存のファイルを参考にする**
   - 似た機能のファイルを見つけて真似する

3. **小さく始める**
   - 最初は1つのコンポーネントから
   - 徐々に理解を深めていく

## 🔄 開発ワークフロー

### ブランチ戦略

- `main`: 本番環境用ブランチ
- `develop`: 開発環境用ブランチ
- `feature/*`: 機能開発用ブランチ
- `fix/*`: バグ修正用ブランチ

### 開発の流れ

1. **ブランチ作成**: `feature/機能名` または `fix/バグ名`
2. **開発**: ローカルで開発・テスト
3. **PR作成**: `develop`ブランチへのプルリクエスト
4. **レビュー**: 
5. **マージ**: レビュー承認後にマージ

### PR作成前のチェック

```bash
# ビルド確認
npm run build

# Lint確認
npm run lint

# 型チェック
npx tsc --noEmit
```

## 🛠️ よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# Lint
npm run lint

# Prismaクライアント生成
npm run prisma:generate

# マイグレーション実行
npm run prisma:migrate

# Prisma Studio起動
npm run prisma:studio

# データベースにスキーマを直接反映
npm run prisma:push
```

## 👥 コントリビューション

詳しくは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。