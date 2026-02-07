# セットアップガイド

このドキュメントでは、milistennaの開発環境のセットアップ手順を説明します。

## 必要な環境

以下のソフトウェアがインストールされている必要があります：

- **Node.js**: v24以上（`mise.toml`で指定）
- **pnpm**: v10.28以上（`mise.toml`で指定）

### miseによる環境管理（推奨）

プロジェクトでは[mise](https://mise.jdx.dev/)を使用してNode.jsとpnpmのバージョンを管理しています。miseがインストールされていれば、プロジェクトディレクトリで自動的に適切なバージョンが使用されます。

```bash
# miseのインストール（未インストールの場合）
curl https://mise.run | sh

# ツールのインストール
mise install
```

### pnpmのインストール（miseを使わない場合）

```bash
npm install -g pnpm
```

または

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/Simirall/milistenna.git
cd milistenna
```

### 2. 依存関係のインストール

```bash
pnpm install
```

このコマンドは、`package.json`に記載されているすべての依存関係をインストールします。

## 開発サーバーの起動

開発サーバーを起動するには、以下のコマンドを実行します：

```bash
pnpm dev
```

デフォルトでは、`http://localhost:5123`でアプリケーションが起動します。ブラウザで自動的に開かない場合は、手動でこのURLにアクセスしてください。

### 開発サーバーの特徴

- **ホットモジュールリロード (HMR)**: ファイルを変更すると、自動的にブラウザが更新されます
- **高速な起動**: Viteの恩恵により、開発サーバーは数秒で起動します
- **SWCによる高速コンパイル**: 開発時はSWCプラグインを使用して高速にビルドされます

## ビルド

プロダクション用にビルドするには、以下のコマンドを実行します：

```bash
pnpm build
```

ビルドされたファイルは`dist`ディレクトリに出力されます。

### ビルドプロセス

1. tsgo（TypeScript native preview）による型チェック (`tsgo -b`)
2. React CompilerによるReactコードの最適化
3. Viteによるバンドルと静的ファイルの生成

## プレビュー

ビルドしたアプリケーションをローカルでプレビューするには：

```bash
pnpm preview
```

このコマンドは、ビルドされたアプリケーションをローカルサーバーで起動します。

## リント

コードのリントを実行するには：

```bash
# リントの実行
pnpm lint

# リントエラーの自動修正
pnpm lint:fix
```

このプロジェクトでは、Biome v2をリンター・フォーマッターとして使用しています。

## トラブルシューティング

### pnpmのインストールエラー

依存関係のインストール中にエラーが発生した場合：

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
pnpm install
```

### ビルドエラー

ビルド中にTypeScriptエラーが発生した場合：

```bash
# tsgoによる型チェックを実行
npx tsgo --noEmit
```

### 開発サーバーが起動しない

ポート5123が既に使用されている場合、`vite.config.ts`の`server.port`を変更するか、以下のコマンドで別のポートを指定できます：

```bash
pnpm dev -- --port 3000
```

## 次のステップ

セットアップが完了したら、以下のドキュメントを参照してください：

- [アーキテクチャ](./ARCHITECTURE.md) - プロジェクトの構造を理解する
- [開発ガイド](./DEVELOPMENT.md) - 開発規約とワークフローを学ぶ
- [機能ドキュメント](./FEATURES.md) - 実装されている機能を確認する
