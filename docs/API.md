# API使用ガイド

このドキュメントでは、milistennaにおけるMisskey APIとの連携方法について説明します。

## 概要

milistennaは、Misskey APIを使用してリストとアンテナを管理します。すべてのAPI呼び出しは、カスタムフックとユーティリティ関数を通じて行われます。

## アーキテクチャ

```
Component
    ↓
Custom Hook (useGetXXX)
    ↓
queryOptions (TanStack Query)
    ↓
useApiQuery
    ↓
fetcher (カリー化関数)
    ↓
getFetchObject (トークン付与)
    ↓
getApiUrl (URL生成)
    ↓
Misskey API
```

## 基本的な使い方

### useApiQuery

Misskey APIのレスポンスを型安全に扱うための基本フック。`useQuery`をラップし、Misskey API固有のエラーハンドリングを提供します。

```typescript
import { queryOptions } from "@tanstack/react-query";
import type { MyData, Error as MkError } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "@/apis/useApiQuery";

const myDataQueryOptions = () =>
  queryOptions<MyData[] | MkError>({
    queryFn: fetcher("my-endpoint"),
    queryKey: ["my-endpoint"],
    ...defaultQueryConfig,
  });

function MyComponent() {
  const { data, isLoading, isApiError, apiError } = useApiQuery(
    myDataQueryOptions(),
  );

  if (isLoading) return <Loader />;
  if (isApiError) return <div>Error: {apiError?.error.message}</div>;

  return <div>{data?.length} items</div>;
}
```

### useApiQueryの特徴

- **型安全**: TypeScriptの型推論により、レスポンスの型が自動的に決定
- **エラーハンドリング**: Misskey APIのエラーレスポンスを`isApiError`/`apiError`プロパティで判別
- **キャッシング**: TanStack Queryによる自動キャッシング（デフォルト5分のstaleTime）

### 返り値

```typescript
{
  data: TData | undefined,        // APIからのデータ（エラー時はundefined）
  isLoading: boolean,             // ローディング中かどうか
  isApiError: boolean,            // Misskey APIエラーかどうか
  apiError: MkError | undefined,  // Misskey APIのエラーオブジェクト
  // ... その他TanStack Queryの返り値
}
```

## Fetcher ユーティリティ

### fetcher関数

Misskey APIへのHTTPリクエストを送信するカリー化された関数。misskey-jsの`Endpoints`型を使用して型安全にエンドポイントを指定します。

```typescript
import { fetcher } from "@/utils/fetcher";

// 基本的な使い方（パラメータなし）
const queryFn = fetcher("antennas/list");

// パラメータ付き
const queryFn = fetcher("antennas/show", { antennaId: "xxx" });

// queryOptionsで使用（推奨パターン）
queryOptions({
  queryFn: fetcher("users/lists/list"),
  queryKey: ["users/lists/list"],
});
```

### fetcher関数の実装

```typescript
export const fetcher =
  (endpoint: keyof Endpoints, obj: Record<string, unknown> = {}) =>
  async () => {
    const res = await fetch(getApiUrl(endpoint), getFetchObject(obj));
    return await res.json();
  };
```

- **カリー化**: `fetcher(endpoint, params)` は `async () => result` を返す（TanStack Queryの`queryFn`として直接使用可能）
- **エンドポイント**: `/api/`プレフィックスは不要（`getApiUrl`が自動付与）
- **トークン**: `getFetchObject`がZustandストアからトークンを自動取得して付与
- **HTTPメソッド**: すべてPOST（Misskey APIの仕様）

### getApiUrl

```typescript
// "https://{instance}/api/{endpoint}" 形式のURLを生成
export const getApiUrl = (endpoint: keyof Endpoints) =>
  `https://${useLoginStore.getState().instance}/api/${endpoint}`;
```

### getFetchObject

```typescript
// fetchのリクエストオブジェクトを生成（トークン自動付与）
export const getFetchObject = (obj) => ({
  body: JSON.stringify({
    i: useLoginStore.getState().token,
    ...obj,
  }),
  headers: { "Content-Type": "application/json" },
  method: "POST",
});
```

## カスタムフックの作成

### 基本パターン

```typescript
// apis/myFeature/useGetMyData.ts
import { queryOptions } from "@tanstack/react-query";
import type { MyData, Error as MkError } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "my-endpoint";

// queryOptionsを分離（ルートローダーでのプリフェッチにも使用可能）
export const myDataQueryOptions = () =>
  queryOptions<MyData[] | MkError>({
    queryFn: fetcher(endpoint),
    queryKey: [endpoint],
    ...defaultQueryConfig,
  });

// カスタムフック
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

### パラメータ付きフック

```typescript
const endpoint = "my-endpoint";

export const myDataShowQueryOptions = (id: string) =>
  queryOptions<MyData | MkError>({
    enabled: !!id,
    queryFn: fetcher(endpoint, { id }),
    queryKey: [endpoint, id],
    ...defaultQueryConfig,
  });

export const useGetMyDataShow = (id: string) => {
  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    myDataShowQueryOptions(id),
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

## 主要なAPIエンドポイント

### 認証

#### MiAuth対応確認

```typescript
// インスタンスがMiAuthに対応しているか確認
const res = await fetch(`https://${instance}/api/endpoints`, {
  body: JSON.stringify({}),
  headers: { "Content-Type": "application/json" },
  method: "POST",
});
const endpoints: ReadonlyArray<string> = await res.json();
const isMiAuthSupported = endpoints.includes("miauth/gen-token");
```

#### MiAuth トークン取得

```typescript
// MiAuth認証後のトークン取得
const res = await fetch(
  `https://${instance}/api/miauth/${sessionId}/check`,
  { method: "POST" },
);
const data = await res.json(); // { token: string }
```

### リスト管理

#### リスト一覧取得

```typescript
export const usersListsListQueryOptions = () =>
  queryOptions<ReadonlyArray<UserList> | MkError>({
    queryFn: fetcher("users/lists/list"),
    queryKey: ["users/lists/list"],
    ...defaultQueryConfig,
  });
```

#### リスト詳細取得

```typescript
export const usersListsShowQueryOptions = (listId: string) =>
  queryOptions<UserList | MkError>({
    enabled: !!listId,
    queryFn: fetcher("users/lists/show", { listId }),
    queryKey: ["users/lists/show", listId],
    ...defaultQueryConfig,
  });
```

#### リスト作成

```typescript
await fetch(getApiUrl("users/lists/create"), getFetchObject({
  name: "リスト名",
}));
```

#### リスト更新

```typescript
await fetch(getApiUrl("users/lists/update"), getFetchObject({
  listId: "list-id",
  name: "新しい名前",
  isPublic: true,
}));
```

#### リスト削除

```typescript
await fetch(getApiUrl("users/lists/delete"), getFetchObject({
  listId: "list-id",
}));
```

#### ユーザー追加（リスト）

```typescript
await fetch(getApiUrl("users/lists/push"), getFetchObject({
  listId: "list-id",
  userId: "user-id",
}));
```

#### ユーザー削除（リスト）

```typescript
await fetch(getApiUrl("users/lists/pull"), getFetchObject({
  listId: "list-id",
  userId: "user-id",
}));
```

### アンテナ管理

#### アンテナ一覧取得

```typescript
export const antennasListQueryOptions = () =>
  queryOptions<ReadonlyArray<Antenna> | MkError>({
    queryFn: fetcher("antennas/list"),
    queryKey: ["antennas/list"],
    ...defaultQueryConfig,
  });
```

#### アンテナ詳細取得

```typescript
export const antennaShowQueryOptions = (antennaId: string) =>
  queryOptions<Antenna | MkError>({
    enabled: !!antennaId && antennaId !== "create",
    queryFn: fetcher("antennas/show", { antennaId }),
    queryKey: ["antennas/show", antennaId],
    ...defaultQueryConfig,
  });
```

#### アンテナ作成

```typescript
await fetch(getApiUrl("antennas/create"), getFetchObject({
  name: "アンテナ名",
  src: "all",    // "all" | "users" | "users_blacklist" | "list"
  keywords: [["keyword1"], ["keyword2"]],
  excludeKeywords: [],
  users: [],
  caseSensitive: false,
  localOnly: false,
  excludeBots: false,
  withReplies: false,
  withFile: false,
  excludeNotesInSensitiveChannel: false,
}));
```

#### アンテナ更新

```typescript
await fetch(getApiUrl("antennas/update"), getFetchObject({
  antennaId: "antenna-id",
  name: "新しい名前",
  // その他の更新項目
}));
```

#### アンテナ削除

```typescript
await fetch(getApiUrl("antennas/delete"), getFetchObject({
  antennaId: "antenna-id",
}));
```

### ユーザー検索

#### ユーザー名とホストで検索

```typescript
export const usersSearchByUsernameAndHostQueryOptions = (
  payload: { username: string; host: string | null },
) =>
  queryOptions<ReadonlyArray<UserDetailed> | MkError>({
    enabled: !!payload.username,
    queryFn: fetcher("users/search-by-username-and-host", {
      host: payload.host,
      username: payload.username,
    }),
    queryKey: ["users/search-by-username-and-host", payload],
    ...defaultQueryConfig,
  });
```

デバウンス付きバージョン:

```typescript
export const useDebouncedGetUsersSearchByUsernameAndHost = (
  payload: SearchPayload,
) => {
  const [username] = useDebounce(payload.username, 500);
  const [host] = useDebounce(payload.host, 500);

  return useGetUsersSearchByUsernameAndHost({ host, username });
};
```

#### フォロー一覧取得

```typescript
// ログイン中のユーザーのフォロー一覧を自動取得
export const useGetUsersFollowing = () => {
  const userId = useLoginStore((state) => state.mySelf?.id);

  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    usersFollowingQueryOptions(userId ?? ""),
  );

  return {
    following: data,
    // ...
  };
};
```

## エラーハンドリング

### Misskey APIエラー

Misskey APIは、エラー時に以下の形式でレスポンスを返します：

```typescript
{
  error: {
    code: string,
    message: string,
    id: string,
  }
}
```

### エラーの判定

```typescript
import { isError } from "@/utils/isError";

// レスポンスにerrorプロパティがあればエラーと判定
if (isError(response)) {
  console.error(response.error.code);
} else {
  console.log(response);
}
```

### コンポーネントでのエラー表示

```typescript
function MyComponent() {
  const { data, isApiError, apiError } = useGetMyData();

  if (isApiError) {
    return <div>エラー: {apiError?.error.message}</div>;
  }

  return <div>{data?.name}</div>;
}
```

## キャッシュ管理

### デフォルト設定

```typescript
// utils/queryConfig.ts
export const DEFAULT_CACHE_TIME = 1000 * 60 * 5; // 5分
export const DEFAULT_RETRY_COUNT = 2;

export const defaultQueryConfig = {
  retry: DEFAULT_RETRY_COUNT,
  staleTime: DEFAULT_CACHE_TIME,
};
```

### キャッシュの無効化

```typescript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await updateData();
    // キャッシュを無効化して再取得
    queryClient.invalidateQueries({ queryKey: ["my-endpoint"] });
  };
}
```

### ルートローダーでのプリフェッチ

queryOptionsを分離することで、ルートローダーからデータをプリフェッチできます：

```typescript
// routes/_auth/myPage/$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { myDataShowQueryOptions } from "@/apis/myFeature/useGetMyData";

export const Route = createFileRoute("/_auth/myPage/$id")({
  beforeLoad: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      myDataShowQueryOptions(params.id),
    );
  },
});
```

## ベストプラクティス

1. **queryOptionsの分離**: カスタムフックとルートローダーの両方で再利用可能にする
2. **適切なqueryKey**: エンドポイント名をキーとして使用し、パラメータを追加
3. **enabledオプション**: 必要な条件が揃ってからクエリを実行
4. **エラーハンドリング**: `isApiError`でMisskey API固有のエラーを判別
5. **型安全性**: misskey-jsのエンドポイント型とエンティティ型を活用
6. **デバウンス**: 検索など頻繁に呼ばれるAPIには`use-debounce`を適用
7. **キャッシュ戦略**: `defaultQueryConfig`のstaleTimeとretryを活用
