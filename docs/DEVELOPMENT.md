# 開発ガイド

このドキュメントでは、milistennaの開発時の規約とベストプラクティスについて説明します。

## コーディング規約

### TypeScript

- **厳密な型付け**: `any`の使用を避け、適切な型を定義する
- **型推論の活用**: 明白な場合は型アノテーションを省略可能
- **インターフェースよりtype**: プロジェクト全体でtypeエイリアスを優先

### 命名規則

- **コンポーネント**: PascalCase（例: `UserCard`, `CreateListModal`）
- **関数/変数**: camelCase（例: `getUserData`, `isLoading`）
- **定数**: camelCase（例: `apiUrl`）
- **ファイル名**:
  - コンポーネント: PascalCase（例: `UserCard.tsx`）
  - ユーティリティ: camelCase（例: `fetcher.ts`）
  - カスタムフック: camelCase with `use`プレフィックス（例: `useGetAntennasList.ts`）

#### 単数/複数の使い分け

- **単数 (`list`, `user`, `antenna`)**: 単一リソースを表す変数/戻り値/関数名に使う
  - 例: `list`, `useGetUsersListsShow`, `queryKeys.lists.show(listId)`
- **複数 (`lists`, `users`, `antennas`)**: 配列や一覧取得を表す変数/戻り値/関数名に使う
  - 例: `lists`, `useGetUsersListsList`, `queryKeys.lists.list`
- **API名に合わせる**: Misskey APIエンドポイントが複数形の場合、フック名・query option名も同じ語形に揃える
  - 例: `users/lists/list` → `usersListsListQueryOptions`, `useGetUsersListsList`

### ファイル構造

```typescript
// インポート順序
// 1. React関連
import { useState, useEffect } from "react";

// 2. サードパーティライブラリ
import { useQuery } from "@tanstack/react-query";

// 3. 内部モジュール（@エイリアスを使用）
import { useLoginStore } from "@/store/login";

// 4. 型定義
import type { User } from "misskey-js/entities.js";
```

## リントとフォーマット

### Biome

プロジェクトではBiome v2を使用してコードの品質を保証しています。

```bash
# リント実行
pnpm lint

# リントエラーを自動修正
pnpm lint:fix
```

### Biome設定

`biome.json`で設定を管理：

- インデント: スペース
- セミコロン: あり
- クォート: ダブルクォート
- インポートの自動整理（assist設定）
- 属性・キーの自動ソート（assist設定）

## コンポーネントの作成

### ドメイン定数・文言の配置

- ポリシーキー・上限文言・画面共通ラベルは `src/constants/` に集約する
- ルートやコンポーネント内でのインライン文字列は、再利用される時点で定数へ切り出す
- ドメイン別にファイルを分ける
  - 例: `src/constants/policies.ts`（ポリシーキー、上限メッセージ）
  - 例: `src/constants/antennas.ts`（アンテナの表示ラベル）
- 文字列組み立てが必要な文言は関数化して定義する
  - 例: ``limitMessages.listCreateReached(limit)``

### ディレクトリの選択

コンポーネントの配置場所を適切に選択：

- **`components/common/`**: 汎用的で再利用可能なコンポーネント
  - 例: ボタン、モーダル、ローディング、エラー表示、上限アラート

- **`components/common/layout/`**: レイアウトに関するコンポーネント
  - 例: グリッドカード、グリッドコンテナ

- **`components/domain/`**: 特定のドメイン（業務概念）に関連するコンポーネント
  - 例: ユーザーカード、ユーザー追加モーダル

- **`routes/_auth/*/​-components/`**: 特定のルートでのみ使用するコンポーネント
  - 例: アンテナフォーム、リスト作成モーダル、削除モーダル
  - `-`プレフィックスによりTanStack Routerのルート生成から除外

### コンポーネントのパターン

```typescript
// 基本的なコンポーネント構造
import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
  onAction?: () => void;
};

export function MyComponent({ title, children, onAction }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

### カスタムフックの作成

```typescript
// apis/myFeature/useGetMyData.ts
import { queryOptions } from "@tanstack/react-query";
import type { MyData, Error as MkError } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { apiEndpoints, queryKeys } from "@/utils/queryKeys";
import { useApiQuery } from "../useApiQuery";

export const myDataQueryOptions = () =>
  queryOptions<ReadonlyArray<MyData> | MkError>({
    queryFn: fetcher(apiEndpoints.myData),
    queryKey: queryKeys.myData,
    ...defaultQueryConfig,
  });

export const useGetMyData = () => {
  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    myDataQueryOptions(),
  );

  return {
    data,
    error,
    isApiError,
    isLoading,
    refetch,
  };
};
```

### TanStack Queryのキャッシュ更新ルール

- `queryKey`は画面やフックで直書きせず、`src/utils/queryKeys.ts`の定数・ビルダーを使う
- 書き込み後の更新は`refetch`ではなく`queryClient.invalidateQueries`を基本とする
- 無効化対象は`src/utils/queryInvalidation.ts`の`invalidateQueriesAfterWrite`に集約する
- `refetch`は「同一コンポーネントで即時再取得が必須」の場合のみ使用する

現在の依存関係は次の通りです。

| 書き込みAPI | invalidate対象 |
|---|---|
| `antennas/create` | `queryKeys.antennas.list` |
| `antennas/update` | `queryKeys.antennas.list`, `queryKeys.antennas.show(antennaId)` |
| `antennas/delete` | `queryKeys.antennas.list`, `queryKeys.antennas.show(antennaId)` |
| `users/lists/create` | `queryKeys.lists.list` |
| `users/lists/update` | `queryKeys.lists.list`, `queryKeys.lists.show(listId)` |
| `users/lists/push` | `queryKeys.lists.list`, `queryKeys.lists.show(listId)` |
| `users/lists/pull` | `queryKeys.lists.list`, `queryKeys.lists.show(listId)` |
| `users/lists/delete` | `queryKeys.lists.list`, `queryKeys.lists.show(listId)`, `queryKeys.antennas.list` |

## ドキュメント同期ルール

実装変更時は、以下のドキュメント更新要否をPR作成時に必ず確認します。

| 変更内容 | 更新対象ドキュメント |
|---|---|
| API呼び出し仕様、エンドポイント、payload構造 | `docs/API.md` |
| 画面仕様、導線、操作方法、文言 | `docs/FEATURES.md` |
| 設計方針、責務分離、レイヤー構成 | `docs/ARCHITECTURE.md` |
| 開発規約、運用ルール、実装パターン | `docs/DEVELOPMENT.md` |
| セットアップ手順、開発環境要件 | `docs/SETUP.md` |
| 改善項目の進捗・完了条件 | `docs/IMPROVEMENT_CHECKLIST.md` |

### 差分更新手順（最小）

1. 実装差分を「機能仕様」「設計」「運用ルール」の3観点で整理する
2. 上表に従って更新対象ドキュメントを特定する
3. ドキュメントへ差分追記後、PR本文で更新/非更新の理由を明記する

## 状態管理

### Zustand

グローバル状態が必要な場合はZustandを使用：

```typescript
// store/myStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  value: string;
};

type Actions = {
  setValue: (value: string) => void;
};

export const useMyStore = create<State & Actions>()(
  persist(
    (set) => ({
      value: "",
      setValue: (value) => set({ value }),
    }),
    { name: "my-store" } // ローカルストレージのキー
  )
);
```

### ローカル状態

コンポーネント内のみで使用する状態は`useState`を使用：

```typescript
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // ...
  );
}
```

## ルーティング

### 新しいルートの追加

1. **ルートファイルを作成**

```typescript
// routes/myPage/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/myPage/")({
  component: MyPage,
});

function MyPage() {
  return <div>My Page</div>;
}
```

2. **遅延ローディングを使用（推奨）**

```typescript
// routes/myPage/index.lazy.tsx
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/myPage/")({
  component: MyPage,
});

function MyPage() {
  return <div>My Page</div>;
}
```

### 認証が必要なルート

`_auth`ディレクトリ配下に配置：

```typescript
// routes/_auth/myProtectedPage/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/myProtectedPage/")({
  component: MyProtectedPage,
});

function MyProtectedPage() {
  return <div>Protected Content</div>;
}
```

### パラメータ付きルート

```typescript
// routes/_auth/item/$id.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/item/$id")({
  component: ItemDetail,
});

function ItemDetail() {
  const { id } = Route.useParams();

  return <div>Item ID: {id}</div>;
}
```

## API呼び出し

### カスタムフックの使用

```typescript
function MyComponent() {
  const { data, isLoading, error } = useGetMyData();

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{data.name}</div>;
}
```

### エラーハンドリング

```typescript
const { data, isApiError, apiError } = useApiQuery(
  myDataQueryOptions(),
);

if (isApiError) {
  // ユーザー向けエラー表示に変換して表示
  const message = getUserErrorMessage(apiError);
  return <ApiErrorMessage message={message} />;
}
```

- ユーザー向け表示は `ApiErrorMessage` に統一する
- エラー文言は `getUserErrorMessage` で変換し、画面で独自分岐を増やさない
- 内部ログは `reportInternalError` 経由で出力し、直接 `console.error` を書かない

## フォーム処理

### TanStack Formの使用

```typescript
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
});

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      // 送信処理
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.Field name="name">
        {(field) => (
          <Field.Root
            errorMessage={field.state.meta.errors[0]?.message}
            invalid={field.state.meta.errors.length > 0}
          >
            <Input
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
            />
          </Field.Root>
        )}
      </form.Field>
    </form>
  );
}
```

## テスト

現在、テストは実装されていません。今後の追加を検討中です。

## デバッグ

### React Developer Tools

ブラウザ拡張機能を使用してコンポーネント階層を確認。

### TanStack Query Devtools

開発時に自動的に有効化（追加設定が必要な場合あり）。

### Console Logging

```typescript
// 開発時のみログ出力
if (import.meta.env.DEV) {
  console.log("Debug info:", data);
}
```

## パフォーマンス最適化

### React Compiler

React Compilerがビルド時に自動的に最適化を行うため、手動でのメモ化は基本的に不要。開発時はSWCプラグインを使用するため、React Compilerは動作しません。

### 遅延ローディング

大きなコンポーネントや使用頻度の低いルートは遅延ローディングを使用。

### 画像最適化

- 適切なフォーマットを使用（WebP推奨）
- サイズを最適化
- 遅延読み込みを検討

## Git ワークフロー

### ブランチ戦略

- `main`: プロダクション用
- `develop`: 開発用（存在する場合）
- `feature/*`: 新機能開発
- `fix/*`: バグ修正

### コミットメッセージ

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの更新
style: コードスタイルの変更（機能に影響なし）
refactor: リファクタリング
perf: パフォーマンス改善
test: テストの追加・修正
chore: ビルドプロセスやツールの変更
```

## ベストプラクティス

1. **小さなコンポーネント**: 1つのコンポーネントは1つの責務
2. **型安全性**: TypeScriptの型システムを最大限活用
3. **再利用性**: 共通ロジックはカスタムフックに抽出
4. **パフォーマンス**: 必要な場合のみ最適化（早すぎる最適化は避ける）
5. **アクセシビリティ**: セマンティックHTMLとARIA属性を適切に使用
6. **コードレビュー**: PRは必ずレビューを受ける
7. **ドキュメント**: 複雑なロジックにはコメントを追加
