import { isError } from "@/utils/isError";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Error as MkError } from "misskey-js/entities.js";

/**
 * Misskey APIのレスポンスを型安全に扱うためのカスタムクエリフック
 * @param queryOptions 通常のuseQueryオプション
 * @returns データ、エラー状態、ロード状態など
 */
export function useApiQuery<TData>(
  queryOptions: UseQueryOptions<TData | MkError, Error>,
) {
  const query = useQuery<TData | MkError, Error>(queryOptions);

  return {
    // 元のクエリ結果をそのまま返す
    ...query,
    // データがエラーの場合はundefined、そうでなければデータを返す
    data: isError(query.data) ? undefined : query.data,
    // データがエラーオブジェクトかどうか
    isApiError: isError(query.data),
    // エラーオブジェクト（あれば）
    apiError: isError(query.data) ? query.data : undefined,
  };
}
