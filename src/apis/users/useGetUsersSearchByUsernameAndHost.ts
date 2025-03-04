import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { queryOptions } from "@tanstack/react-query";
import type { Error as MkError, UserDetailed } from "misskey-js/entities.js";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import { useApiQuery } from "../useApiQuery";

const endpoint = "users/search-by-username-and-host";

/**
 * ユーザー検索のためのペイロード型
 * @property username - 検索するユーザー名
 * @property host - 検索するホスト（nullable）
 */
const searchPayloadSchema = z.object({
  username: z.string(),
  host: z.string().nullable(),
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
    queryKey: [endpoint, payload],
    queryFn: fetcher(endpoint, {
      username: payload.username,
      host: payload.host,
    }),
    enabled: !!payload.username,
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
    users: data,
    isLoading,
    isApiError,
    error,
    refetch,
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
  const [username] = useDebounce(payload.username, 1000);
  const [host] = useDebounce(payload.host, 1000);

  // デバウンスした値を使ってユーザー検索を実行
  const { users, isLoading, isApiError, error, refetch } =
    useGetUsersSearchByUsernameAndHost({
      username,
      host,
    });

  return {
    users,
    isLoading,
    isApiError,
    error,
    refetch,
  };
};
