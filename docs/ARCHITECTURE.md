# アーキテクチャ

このドキュメントでは、milistennaの技術構成とプロジェクト構造について説明します。

## 技術スタック

### コアライブラリ

- **React 19.1.1**: UIライブラリ
  - React Compiler対応により、最適化されたレンダリング
  - StrictModeでの開発

- **TypeScript 5.9.2**: 型安全な開発
  - 厳密な型チェック
  - 型推論による開発効率の向上

- **Vite 7.0.6**: ビルドツール
  - 高速な開発サーバー
  - 最適化されたプロダクションビルド

### ルーティング

- **TanStack Router 1.130.12**
  - 型安全なルーティング
  - ファイルベースルーティング
  - 遅延ローディング対応
  - ルートコンテキストでの状態共有

### データフェッチング

- **TanStack Query 5.84.1**
  - サーバー状態の管理
  - キャッシング
  - バックグラウンド更新
  - 楽観的更新

### UIフレームワーク

- **Yamada UI 1.7.7**
  - React用のUIコンポーネントライブラリ
  - カラーモード対応
  - レスポンシブデザイン
  - アクセシビリティ対応

### 状態管理

- **Zustand 5.0.7**
  - 軽量な状態管理ライブラリ
  - ローカルストレージへの永続化
  - ログイン状態の管理

### フォーム管理

- **TanStack Form 1.16.0**
  - 型安全なフォーム処理
  - バリデーション統合
  - パフォーマンス最適化

### バリデーション

- **Zod 4.0.14**
  - スキーマベースのバリデーション
  - TypeScriptとの統合

### Misskey連携

- **misskey-js 2025.8.0-alpha.4**
  - Misskey APIのTypeScript定義
  - エンティティ型の提供

### その他のライブラリ

- **@phosphor-icons/react**: アイコンライブラリ
- **uuid**: ユニークIDの生成
- **use-debounce**: デバウンス処理

### 開発ツール

- **Biome 2.1.3**: リンターとフォーマッター
- **@vitejs/plugin-react-swc**: SWCによる高速なコンパイル

## プロジェクト構造

```
milistenna/
├── public/              # 静的ファイル
│   ├── favicon.ico
│   └── apple-touch-icon.png
├── src/
│   ├── @types/         # TypeScript型定義
│   ├── apis/           # API呼び出しロジック
│   │   ├── antennas/   # アンテナ関連API
│   │   ├── lists/      # リスト関連API
│   │   ├── users/      # ユーザー関連API
│   │   └── useApiQuery.ts
│   ├── components/     # Reactコンポーネント
│   │   ├── common/     # 共通コンポーネント
│   │   ├── domain/     # ドメイン固有のコンポーネント
│   │   └── layout/     # レイアウトコンポーネント
│   ├── constants/      # 定数定義
│   ├── routes/         # ルート定義
│   │   ├── _auth/      # 認証が必要なルート
│   │   ├── login/      # ログイン関連
│   │   ├── __root.tsx  # ルートレイアウト
│   │   └── index.tsx   # トップページ
│   ├── store/          # 状態管理
│   │   └── login.ts    # ログイン状態
│   ├── theme/          # テーマ設定
│   ├── utils/          # ユーティリティ関数
│   ├── App.tsx         # アプリケーションルート
│   ├── main.tsx        # エントリーポイント
│   └── routeTree.gen.ts # 自動生成されたルート定義
├── docs/               # ドキュメント
├── biome.json          # Biome設定
├── package.json        # プロジェクト設定
├── tsconfig.json       # TypeScript設定
├── vite.config.ts      # Vite設定
└── tsr.config.json     # TanStack Router設定
```

## ディレクトリの役割

### `/src/apis`

Misskey APIとの通信を担当するカスタムフック群。各エンドポイントに対応したフックが定義されています。

- `useApiQuery.ts`: API呼び出しの基本ロジック
- `antennas/`: アンテナ関連のAPI呼び出し
- `lists/`: リスト関連のAPI呼び出し
- `users/`: ユーザー関連のAPI呼び出し

### `/src/components`

Reactコンポーネントを機能ごとに分類して配置。

- **common/**: 汎用的なコンポーネント（ボタン、ローダー、モーダルなど）
- **domain/**: ドメイン固有のコンポーネント（ユーザーカード、リストカードなど）
- **layout/**: レイアウトコンポーネント（ヘッダー、グリッドなど）

### `/src/routes`

TanStack Routerのファイルベースルーティングに従った構造。

- **_auth/**: 認証が必要なルート（プレフィックス`_`は特別なルート）
- **login/**: ログイン関連のルート
- **__root.tsx**: すべてのルートの親となるレイアウト

### `/src/store`

Zustandを使用したグローバル状態管理。

- **login.ts**: ログイン状態（トークン、インスタンス情報、ユーザー情報）

### `/src/utils`

共通のユーティリティ関数。

- **fetcher.ts**: API呼び出しの基本関数
- **getApiUrl.ts**: APIのURL生成
- **isError.ts**: エラー判定
- **queryConfig.ts**: TanStack Queryの設定

## データフロー

```
User Action
    ↓
Component
    ↓
Custom Hook (useApiQuery)
    ↓
Fetcher Utility
    ↓
Misskey API
    ↓
TanStack Query (Cache)
    ↓
Component (Re-render)
```

## 認証フロー

1. ユーザーがインスタンス名を入力
2. MiAuth URLを生成し、認証ページにリダイレクト
3. ユーザーが認証を許可
4. コールバックURLでトークンを取得
5. Zustandストアにトークンとインスタンス情報を保存
6. ローカルストレージに永続化

## ルーティング

TanStack Routerを使用した型安全なルーティング。

- ファイルベースルーティング
- 遅延ローディング（`.lazy.tsx`ファイル）
- ルートコンテキストで認証状態を共有
- 認証が必要なルートは`_auth`ディレクトリ配下に配置

## スタイリング

Yamada UIのコンポーネントとテーマシステムを使用。

- カラーモード（ライト/ダーク）対応
- レスポンシブデザイン
- カスタムテーマ設定（`src/theme/`）

## ビルドプロセス

1. TypeScriptのコンパイル
2. React Compilerによる最適化
3. Viteによるバンドル
4. 静的ファイルの生成

## パフォーマンス最適化

- React 19のReact Compiler使用
- TanStack Routerの遅延ローディング
- TanStack Queryのキャッシング
- SWCによる高速なコンパイル
