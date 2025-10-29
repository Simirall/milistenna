import { queryOptions } from "@tanstack/react-query";
import type { Following, Error as MkError } from "misskey-js/entities.js";
import { useLoginStore } from "@/store/login";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "users/following";

/**
 * フォロー中のユーザー一覧を取得するためのクエリオプション
 * @param userId - フォロー取得対象のユーザーID
 * @returns フォロー中のユーザー一覧を取得するためのクエリオプション
 */
export const usersFollowingQueryOptions = (userId: string) =>
  queryOptions<ReadonlyArray<Following> | MkError>({
    queryKey: [endpoint, userId],
    queryFn: fetcher(endpoint, {
      limit: 10,
      userId,
    }),
    enabled: !!userId,
    ...defaultQueryConfig,
  });

/**
 * フォロー中のユーザー一覧を取得するためのカスタムフック
 * ログイン中のユーザーのフォロー中のユーザー一覧を取得
 * @returns フォロー中のユーザー一覧とクエリの状態
 */
export const useGetUsersFollowing = () => {
  const userId = useLoginStore((state) => state.mySelf?.id);

  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    usersFollowingQueryOptions(userId ?? ""),
  );

  return {
    following: data,
    isLoading,
    isApiError,
    error,
    refetch,
  };
};
