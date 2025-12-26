# コントリビューションガイド

## 🌱 開発環境のセットアップ

[README.md](README.md) の「セットアップ」セクションを参照してください。

## 📝 開発フロー

### 1. ブランチを作成

developブランチから新しいブランチを作成します。

```bash
# 最新のdevelopブランチを取得
git checkout develop
git pull origin develop

# 新しいブランチを作成
git checkout -b feature/機能名
# または
git checkout -b fix/バグ名
```

**ブランチ命名規則**:
- 新機能: `feature/機能名` (例: `feature/add-map-marker`)
- バグ修正: `fix/バグ名` (例: `fix/map-loading-error`)
- リファクタリング: `refactor/内容` (例: `refactor/simplify-api`)

### 2. 開発

#### コミットメッセージ

わかりやすいコミットメッセージを書きましょう。

```bash
# 良い例
git commit -m "add: マップマーカーコンポーネントを追加"
git commit -m "fix: マップの初期位置が正しく設定されない問題を修正"
git commit -m "update: 座席情報の表示UIを改善"

# 悪い例
git commit -m "update"
git commit -m "fix"
git commit -m "WIP"
```

**プレフィックス**:
- `add`: 新機能追加
- `fix`: バグ修正
- `update`: 既存機能の更新・改善
- `refactor`: リファクタリング
- `remove`: 機能削除
- `docs`: ドキュメント更新

### 3. プルリクエスト（PR）を作成

#### PR作成前のチェックリスト

```bash
# ビルドが通るか確認
npm run build

# Lintエラーがないか確認
npm run lint

# 型エラーがないか確認
npx tsc --noEmit
```

すべて通ったらPRを作成します。

#### PR作成手順

1. 変更をプッシュ
```bash
git push origin feature/機能名
```

2. GitHubでPRを作成
   - PRテンプレートに沿って記入

### 4. コードレビュー

#### レビュアー側

- コードの品質をチェック
- ロジックに問題がないか確認
- 改善提案があればコメント
- 承認（Approve）またはコメント

#### PR作成者側

- レビューコメントに対応
- 修正したらコメントで報告
- すべて対応したら再レビューを依頼

### 5. マージ

- レビューが承認されたらマージ
- マージ後はブランチを削除

```bash
# ローカルブランチの削除
git checkout main
git pull origin main
git branch -d feature/機能名
```

## 🚫 やってはいけないこと

- mainブランチに直接プッシュ
- レビューなしでマージ
- `.env`ファイルをコミット
- ビルドエラーがある状態でPR作成
- 大きすぎる変更を1つのPRに含める

## ✅ ベストプラクティス

- 小さく頻繁にコミット
- PRは小さく保つ（1つの機能・修正に集中）
- コメントで意図を明確にする
- チーム内でコミュニケーションを取る
