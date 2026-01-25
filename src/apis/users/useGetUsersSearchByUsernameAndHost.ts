import { queryOptions } from "@tanstack/react-query";
import type { Error as MkError, UserDetailed } from "misskey-js/entities.js";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "users/search-by-username-and-host";

/**
 * ユーザー検索のためのペイロード型
 * @property username - 検索するユーザー名
 * @property host - 検索するホスト（nullable）
 */
const searchPayloadSchema = z.object({
  host: z.string().nullable(),
  username: z.string(),
});

type SearchPayload = z.infer<typeof searchPayloadSchema>;

/**
 * ユーザー検索のためのクエリオプション
 * @param payload - 検索条件を含むペイロード
 * @returns ユーザー検索のためのクエリオプション
 */
export const usersSearchByUsernameAndHostQueryOptions = (
  payload: SearchPayload,
) =>
  queryOptions<ReadonlyArray<UserDetailed> | MkError>({
    enabled: !!payload.username,
    queryFn: fetcher(endpoint, {
      host: payload.host,
      username: payload.username,
    }),
    queryKey: [endpoint, payload],
    ...defaultQueryConfig,
  });

/**
 * ユーザー検索を行うためのカスタムフック
 * エラーハンドリングは useApiQuery で統一的に処理
 * @param payload - 検索条件を含むペイロード
 * @returns ユーザー情報とクエリの状態
 */
export const useGetUsersSearchByUsernameAndHost = (payload: SearchPayload) => {
  const queryOptions = usersSearchByUsernameAndHostQueryOptions(payload);
  const { data, isLoading, error, refetch, isApiError } =
    useApiQuery(queryOptions);

  return {
    error,
    isApiError,
    isLoading,
    refetch,
    users: data,
  };
};

/**
 * デバウンス処理付きのユーザー検索カスタムフック
 * 入力値の変更から一定時間（1秒）後にクエリを実行
 * @param payload - 検索条件を含むペイロード（デバウンス前）
 * @returns ユーザー情報とクエリの状態
 */
export const useDebouncedGetUsersSearchByUsernameAndHost = (
  payload: SearchPayload,
) => {
  // 入力からAPI呼び出しまでを1秒間デバウンスする
  const [username] = useDebounce(payload.username, 500);
  const [host] = useDebounce(payload.host, 500);

  // デバウンスした値を使ってユーザー検索を実行
  const { users, isLoading, isApiError, error, refetch } =
    useGetUsersSearchByUsernameAndHost({
      host,
      username,
    });

  return {
    error,
    isApiError,
    isLoading,
    refetch,
    users,
  };
};
