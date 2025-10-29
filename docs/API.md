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
useApiQuery
    ↓
TanStack Query
    ↓
fetcher utility
    ↓
Misskey API
```

## 基本的な使い方

### useApiQuery

Misskey APIのレスポンスを型安全に扱うための基本フック。

```typescript
import { useApiQuery } from "@/apis/useApiQuery";
import { fetcher } from "@/utils/fetcher";

function MyComponent() {
  const { data, isLoading, isApiError, apiError } = useApiQuery({
    queryKey: ["myData"],
    queryFn: () => fetcher("/api/endpoint", { param: "value" }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isApiError) return <div>Error: {apiError.message}</div>;

  return <div>{data.name}</div>;
}
```

### useApiQueryの特徴

- **型安全**: TypeScriptの型推論により、レスポンスの型が自動的に決定
- **エラーハンドリング**: Misskey APIのエラーを専用のプロパティで取得
- **キャッシング**: TanStack Queryによる自動キャッシング

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

Misskey APIへのHTTPリクエストを送信する基本関数。

```typescript
import { fetcher } from "@/utils/fetcher";

const result = await fetcher("/api/endpoint", {
  param1: "value1",
  param2: "value2",
});
```

### 内部動作

1. ログイン情報（トークン、インスタンス）を取得
2. APIのURLを生成
3. POSTリクエストを送信（すべてのMisskey APIはPOST）
4. レスポンスをJSONとして解析
5. エラーハンドリング

### エラーハンドリング

```typescript
try {
  const result = await fetcher("/api/endpoint", {});
} catch (error) {
  // ネットワークエラーまたはHTTPエラー
  console.error(error);
}
```

## カスタムフックの作成

### 基本パターン

```typescript
// apis/myFeature/useGetMyData.ts
import { useApiQuery } from "@/apis/useApiQuery";
import { fetcher } from "@/utils/fetcher";
import type { MyData } from "misskey-js/entities.js";

export function useGetMyData() {
  const query = useApiQuery<MyData[]>({
    queryKey: ["myData"],
    queryFn: () => fetcher("/api/my-endpoint", {}),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isApiError,
    error: query.apiError,
  };
}
```

### パラメータ付きフック

```typescript
export function useGetMyDataById(id: string) {
  const query = useApiQuery<MyData>({
    queryKey: ["myData", id],
    queryFn: () => fetcher("/api/my-endpoint", { id }),
    enabled: !!id, // idがある場合のみ実行
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
  };
}
```

## 主要なAPIエンドポイント

### 認証

#### MiAuth トークン取得

```typescript
const result = await fetcher("/api/miauth/{sessionId}/check", {});
```

### リスト管理

#### リスト一覧取得

```typescript
export function useGetUserListsList() {
  const query = useApiQuery<UserList[]>({
    queryKey: ["users", "lists", "list"],
    queryFn: () => fetcher("/api/users/lists/list", {}),
  });

  return {
    lists: query.data,
  };
}
```

#### リスト詳細取得

```typescript
export function useGetUsersListsShow(listId: string) {
  const query = useApiQuery<UserList>({
    queryKey: ["users", "lists", "show", listId],
    queryFn: () => fetcher("/api/users/lists/show", { listId }),
    enabled: !!listId,
  });

  return {
    list: query.data,
  };
}
```

#### リスト作成

```typescript
const result = await fetcher("/api/users/lists/create", {
  name: "リスト名",
});
```

#### リスト更新

```typescript
const result = await fetcher("/api/users/lists/update", {
  listId: "list-id",
  name: "新しい名前",
});
```

#### リスト削除

```typescript
const result = await fetcher("/api/users/lists/delete", {
  listId: "list-id",
});
```

#### ユーザー追加

```typescript
const result = await fetcher("/api/users/lists/push", {
  listId: "list-id",
  userId: "user-id",
});
```

#### ユーザー削除

```typescript
const result = await fetcher("/api/users/lists/pull", {
  listId: "list-id",
  userId: "user-id",
});
```

### アンテナ管理

#### アンテナ一覧取得

```typescript
export function useGetAntennasList() {
  const query = useApiQuery<Antenna[]>({
    queryKey: ["antennas", "list"],
    queryFn: () => fetcher("/api/antennas/list", {}),
  });

  return {
    antennas: query.data,
  };
}
```

#### アンテナ詳細取得

```typescript
export function useGetAntennasShow(antennaId: string) {
  const query = useApiQuery<Antenna>({
    queryKey: ["antennas", "show", antennaId],
    queryFn: () => fetcher("/api/antennas/show", { antennaId }),
    enabled: !!antennaId,
  });

  return {
    antenna: query.data,
  };
}
```

#### アンテナ作成

```typescript
const result = await fetcher("/api/antennas/create", {
  name: "アンテナ名",
  src: "all", // "home" | "all" | "users" | "list" | "users_blacklist"
  keywords: [["keyword1"], ["keyword2"]],
  excludeKeywords: [["exclude"]],
  users: [],
  caseSensitive: false,
  localOnly: false,
  withReplies: false,
  withFile: false,
});
```

#### アンテナ更新

```typescript
const result = await fetcher("/api/antennas/update", {
  antennaId: "antenna-id",
  name: "新しい名前",
  // その他の更新項目
});
```

#### アンテナ削除

```typescript
const result = await fetcher("/api/antennas/delete", {
  antennaId: "antenna-id",
});
```

### ユーザー検索

#### ユーザー名で検索

```typescript
export function useGetUsersSearchByUsernameAndHost(
  query: string,
  limit = 10
) {
  const debouncedQuery = useDebounce(query, 500);

  const result = useApiQuery<User[]>({
    queryKey: ["users", "search-by-username-and-host", debouncedQuery],
    queryFn: () =>
      fetcher("/api/users/search-by-username-and-host", {
        username: debouncedQuery,
        limit,
      }),
    enabled: debouncedQuery.length > 0,
  });

  return {
    users: result.data,
  };
}
```

#### フォロー一覧取得

```typescript
export function useGetUsersFollowing(userId: string) {
  const query = useApiQuery<Following[]>({
    queryKey: ["users", "following", userId],
    queryFn: () => fetcher("/api/users/following", { userId }),
    enabled: !!userId,
  });

  return {
    following: query.data,
  };
}
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

if (isError(response)) {
  // エラーオブジェクト
  console.error(response.error.code);
} else {
  // 正常なデータ
  console.log(response);
}
```

### コンポーネントでのエラー表示

```typescript
function MyComponent() {
  const { data, isApiError, apiError } = useGetMyData();

  if (isApiError) {
    return (
      <ErrorMessage>
        エラー: {apiError.error.message}
      </ErrorMessage>
    );
  }

  return <div>{data.name}</div>;
}
```

## キャッシュ管理

### キャッシュの無効化

```typescript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await updateData();
    // キャッシュを無効化して再取得
    queryClient.invalidateQueries({ queryKey: ["myData"] });
  };
}
```

### 楽観的更新

```typescript
const mutation = useMutation({
  mutationFn: updateData,
  onMutate: async (newData) => {
    // 進行中のクエリをキャンセル
    await queryClient.cancelQueries({ queryKey: ["myData"] });

    // 現在のデータを保存
    const previousData = queryClient.getQueryData(["myData"]);

    // 楽観的に更新
    queryClient.setQueryData(["myData"], newData);

    return { previousData };
  },
  onError: (err, newData, context) => {
    // エラー時にロールバック
    queryClient.setQueryData(["myData"], context.previousData);
  },
  onSettled: () => {
    // 最終的に再取得
    queryClient.invalidateQueries({ queryKey: ["myData"] });
  },
});
```

## ベストプラクティス

1. **カスタムフックの使用**: 直接fetcherを呼ぶのではなく、カスタムフックを作成
2. **適切なqueryKey**: キャッシュを適切に管理するため、意味のあるキーを使用
3. **enabledオプション**: 必要な条件が揃ってからクエリを実行
4. **エラーハンドリング**: すべてのAPI呼び出しでエラー処理を実装
5. **型安全性**: misskey-jsの型定義を活用
6. **デバウンス**: 検索など頻繁に呼ばれるAPIにはデバウンスを適用
7. **キャッシュ戦略**: staleTimeとcacheTimeを適切に設定

## デバッグ

### API呼び出しのログ

```typescript
// utils/fetcher.ts内
if (import.meta.env.DEV) {
  console.log("API Request:", endpoint, body);
  console.log("API Response:", result);
}
```

### TanStack Query DevTools

開発時にクエリの状態を確認：

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <>
      <YourApp />
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </>
  );
}
```

## セキュリティ

- **トークンの保護**: トークンはログイン状態のみで保持
- **HTTPS**: 本番環境では必ずHTTPSを使用
- **入力のサニタイズ**: ユーザー入力は適切にバリデーション
- **権限の最小化**: 必要最小限の権限のみリクエスト
