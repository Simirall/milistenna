# アーキテクチャ

このドキュメントでは、milistennaの技術構成とプロジェクト構造について説明します。

## 技術スタック

### コアライブラリ

- **React v19**: UIライブラリ
  - React Compiler対応により、最適化されたレンダリング（ビルド時）
  - StrictModeでの開発

- **TypeScript (tsgo v7 native-preview)**: 型安全な開発
  - ネイティブ版TypeScriptコンパイラによる高速な型チェック
  - 厳密な型チェック（`strict: true`）

- **Vite v7**: ビルドツール
  - 高速な開発サーバー（ポート5123）
  - 最適化されたプロダクションビルド

### ルーティング

- **TanStack Router v1**
  - 型安全なルーティング
  - ファイルベースルーティング（Viteプラグインによる自動生成）
  - 遅延ローディング対応（`.lazy.tsx`ファイル）
  - ルートコンテキストでの認証状態共有

### データフェッチング

- **TanStack Query v5**
  - サーバー状態の管理
  - キャッシング（デフォルト5分のstaleTime）
  - バックグラウンド更新

### UIフレームワーク

- **Yamada UI v2**
  - React用のUIコンポーネントライブラリ
  - カラーモード対応（ライト/ダーク）
  - レスポンシブデザイン
  - アクセシビリティ対応

### 状態管理

- **Zustand v5**
  - 軽量な状態管理ライブラリ
  - ローカルストレージへの永続化（`persist`ミドルウェア）
  - ログイン状態の管理

### フォーム管理

- **TanStack Form v1**
  - 型安全なフォーム処理
  - Zodによるバリデーション統合

### バリデーション

- **Zod v4**
  - スキーマベースのバリデーション
  - TypeScriptとの統合

### Misskey連携

- **misskey-js v2026**
  - Misskey APIのTypeScript定義
  - エンティティ型の提供
  - APIエンドポイント型の提供

### その他のライブラリ

- **@phosphor-icons/react**: アイコンライブラリ
- **uuid**: MiAuth用のセッションID生成
- **use-debounce**: ユーザー検索のデバウンス処理

### 開発ツール

- **Biome v2**: リンターとフォーマッター
- **@vitejs/plugin-react-swc**: 開発時のSWCによる高速コンパイル
- **@vitejs/plugin-react**: ビルド時のReact Compiler対応
- **mise**: Node.jsとpnpmのバージョン管理

## プロジェクト構造

```
milistenna/
├── public/              # 静的ファイル
│   ├── 192.png          # PWAアイコン (192x192)
│   ├── 512.png          # PWAアイコン (512x512)
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   └── site.webmanifest # PWAマニフェスト
├── src/
│   ├── @types/         # TypeScript型定義
│   │   └── vite-env.d.ts
│   ├── apis/           # API呼び出しロジック
│   │   ├── useApiQuery.ts  # API呼び出しの基本フック
│   │   ├── antennas/   # アンテナ関連API
│   │   │   ├── useGetAntennasList.ts
│   │   │   └── useGetAntennasShow.ts
│   │   ├── lists/      # リスト関連API
│   │   │   ├── useGetUsersListsList.ts
│   │   │   └── useGetUsersListsShow.ts
│   │   └── users/      # ユーザー関連API
│   │       ├── useGetUsersFollowing.ts
│   │       ├── useGetUsersSearchByUsernameAndHost.ts
│   │       └── useGetUsersShow.ts
│   ├── components/     # Reactコンポーネント
│   │   ├── Header.tsx      # ヘッダーコンポーネント
│   │   ├── HeaderMenu.tsx  # ヘッダーメニュー（カラーモード切替、ログアウト）
│   │   ├── common/     # 汎用コンポーネント
│   │   │   ├── Confirm.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ExternalLinkButton.tsx
│   │   │   ├── FloatLinkButton.tsx
│   │   │   ├── LimitAlert.tsx
│   │   │   ├── LinkButton.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── layout/    # レイアウト関連
│   │   │       ├── GridCard.tsx
│   │   │       └── GridContainer.tsx
│   │   └── domain/     # ドメイン固有コンポーネント
│   │       └── user/
│   │           ├── AddUserModal.tsx
│   │           └── UserCard.tsx
│   ├── constants/      # 定数定義
│   │   └── appName.ts
│   ├── routes/         # ルート定義（TanStack Router）
│   │   ├── __root.tsx  # ルートレイアウト
│   │   ├── index.tsx   # トップページ（ローダー）
│   │   ├── index.lazy.tsx # トップページ（コンポーネント）
│   │   ├── _auth/      # 認証が必要なルート
│   │   │   ├── route.tsx       # 認証ガード
│   │   │   ├── antenna/        # アンテナ管理
│   │   │   │   ├── index.lazy.tsx   # アンテナ一覧
│   │   │   │   ├── $edit.tsx        # 編集/作成ローダー
│   │   │   │   ├── $edit.lazy.tsx   # 編集/作成フォーム
│   │   │   │   └── -components/     # ルート専用コンポーネント
│   │   │   └── list/           # リスト管理
│   │   │       ├── index.lazy.tsx   # リスト一覧
│   │   │       ├── $edit.tsx        # 編集ローダー
│   │   │       ├── $edit.lazy.tsx   # 編集フォーム
│   │   │       └── -components/     # ルート専用コンポーネント
│   │   └── login/      # ログイン関連
│   │       ├── route.tsx       # ログイン済みリダイレクト
│   │       ├── index.tsx       # ログインページ
│   │       └── getToken/       # トークン取得
│   ├── store/          # 状態管理
│   │   └── login.ts    # ログイン状態
│   ├── theme/          # テーマ設定
│   │   └── index.ts    # Yamada UIテーマ・コンフィグ
│   ├── utils/          # ユーティリティ関数
│   │   ├── fetcher.ts      # API呼び出しの基本関数
│   │   ├── getApiUrl.ts    # APIのURL生成
│   │   ├── getFetchObject.ts # fetchリクエストオブジェクト生成
│   │   ├── isError.ts      # Misskey APIエラー判定
│   │   ├── keywords.ts     # キーワード配列⇔文字列変換
│   │   └── queryConfig.ts  # TanStack Queryのデフォルト設定
│   ├── App.tsx         # アプリケーションルート
│   ├── main.tsx        # エントリーポイント
│   └── routeTree.gen.ts # 自動生成されたルート定義
├── docs/               # ドキュメント
├── biome.json          # Biome設定
├── mise.toml           # mise設定（Node.js/pnpmバージョン）
├── package.json        # プロジェクト設定
├── tsconfig.json       # TypeScript設定（プロジェクトリファレンス）
├── tsconfig.base.json  # TypeScript基本設定
├── tsconfig.app.json   # アプリケーションTS設定
├── tsconfig.node.json  # Node.js用TS設定
├── vite.config.ts      # Vite設定
└── tsr.config.json     # TanStack Router設定
```

## ディレクトリの役割

### `/src/apis`

Misskey APIとの通信を担当するカスタムフック群。各エンドポイントに対応したフックと`queryOptions`が定義されています。

- `useApiQuery.ts`: API呼び出しの基本ロジック（エラーハンドリング含む）
- `antennas/`: アンテナ関連のAPI呼び出し
- `lists/`: リスト関連のAPI呼び出し
- `users/`: ユーザー関連のAPI呼び出し（検索、フォロー、詳細取得）

### `/src/components`

Reactコンポーネントを分類して配置。

- **Header.tsx / HeaderMenu.tsx**: アプリケーション全体のヘッダー
- **common/**: 汎用的なコンポーネント（ボタン、ローダー、確認ダイアログ、上限アラートなど）
- **common/layout/**: レイアウトコンポーネント（グリッドカード、グリッドコンテナ）
- **domain/**: ドメイン固有のコンポーネント（ユーザーカード、ユーザー追加モーダルなど）

### `/src/routes`

TanStack Routerのファイルベースルーティングに従った構造。`-`プレフィックスのディレクトリ（`-components/`）はルート生成から除外され、ルート専用コンポーネントの配置に使用されます。

- **_auth/**: 認証が必要なルート（プレフィックス`_`はレイアウトルート）
- **_auth/antenna/**: アンテナ管理ページ群
- **_auth/list/**: リスト管理ページ群
- **login/**: ログイン関連のルート
- **__root.tsx**: すべてのルートの親となるレイアウト

### `/src/store`

Zustandを使用したグローバル状態管理。

- **login.ts**: ログイン状態（`isLogin`, `token`, `instance`, `mySelf`）

### `/src/utils`

共通のユーティリティ関数。

- **fetcher.ts**: misskey-jsのエンドポイント型を使った型安全なAPI呼び出し関数（カリー化）
- **getApiUrl.ts**: APIのURL生成（`https://{instance}/api/{endpoint}`形式）
- **getFetchObject.ts**: POSTリクエストのbodyとheadersを生成（トークン自動付与）
- **isError.ts**: Misskey APIのエラーレスポンス判定
- **keywords.ts**: キーワード2次元配列と表示用文字列の相互変換
- **queryConfig.ts**: TanStack Queryのデフォルト設定（5分のstaleTime、2回のリトライ）

## データフロー

```
User Action
    ↓
Component
    ↓
Custom Hook (useApiQuery + queryOptions)
    ↓
fetcher (カリー化された関数)
    ↓
getFetchObject (トークン付与)
    ↓
getApiUrl (URL生成)
    ↓
fetch API → Misskey API
    ↓
TanStack Query (Cache)
    ↓
Component (Re-render)
```

## 認証フロー

1. ユーザーがインスタンス名を入力（Zodでドメイン形式をバリデーション）
2. `/api/endpoints`を呼び出して`miauth/gen-token`の対応を確認
3. UUIDでセッションIDを生成し、MiAuth URLにリダイレクト
4. ユーザーが認証を許可後、コールバックURLに戻る
5. `/api/miauth/{sessionId}/check`でトークンを取得
6. `/api/i`でユーザー情報を取得
7. Zustandストアに保存 → ローカルストレージに永続化

## ルーティング

TanStack Routerを使用した型安全なルーティング。

| パス | 説明 |
|---|---|
| `/` | トップページ（リスト管理・アンテナ管理への導線） |
| `/login` | ログインページ |
| `/login/getToken` | トークン取得（MiAuthコールバック） |
| `/list` | リスト一覧（認証必須） |
| `/list/:edit` | リスト編集（認証必須） |
| `/antenna` | アンテナ一覧（認証必須） |
| `/antenna/:edit` | アンテナ編集/作成（認証必須、`create`で新規作成） |

- ファイルベースルーティング（`@tanstack/router-plugin/vite`で自動生成）
- 遅延ローディング（`.lazy.tsx`ファイル）
- ルートコンテキストで認証状態とQueryClientを共有
- `_auth`レイアウトで認証ガード（未認証時は`/login`にリダイレクト）
- `login`レイアウトで認証済みガード（認証済みの場合は`/`にリダイレクト）

## スタイリング

Yamada UIのコンポーネントとテーマシステムを使用。

- カラーモード（ライト/ダーク）対応
- レスポンシブデザイン
- カスタムテーマ設定（`src/theme/`）
- グラスモーフィズム効果のヘッダー

## ビルドプロセス

1. tsgo（TypeScript native preview）による型チェック
2. React Compilerによる最適化（ビルド時のみ、`babel-plugin-react-compiler`）
3. Viteによるバンドル
4. 静的ファイルの生成

## パフォーマンス最適化

- React Compilerによる自動最適化（ビルド時）
- 開発時はSWCプラグインによる高速コンパイル
- TanStack Routerの遅延ローディング
- TanStack Queryのキャッシング
- ルートローダーによるデータのプリフェッチ
