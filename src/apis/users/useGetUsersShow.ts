import { queryOptions } from "@tanstack/react-query";
import type { Error as MkError, UserDetailed } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "users/show";

/**
 * ユーザーの詳細情報を取得するためのクエリオプション
 * @param userId - 取得対象のユーザーID
 * @returns ユーザー詳細情報を取得するためのクエリオプション
 */
export const usersShowQueryOptions = (userId: string) =>
  queryOptions<UserDetailed | MkError>({
    enabled: !!userId,
    queryFn: fetcher(endpoint, {
      userId,
    }),
    queryKey: [endpoint, userId],
    ...defaultQueryConfig,
  });

/**
 * 特定のユーザー情報を取得するフック
 * @param userId - 取得対象のユーザーID
 * @returns 特定のユーザー情報とクエリの状態
 */
export const useGetUsersShow = (userId: string) => {
  const queryOptions = usersShowQueryOptions(userId);
  const { data, isLoading, isError, error, refetch, isApiError, apiError } =
    useApiQuery(queryOptions);

  return {
    apiError,
    error,
    isApiError,
    isError,
    isLoading,
    refetch,
    user: data,
  };
};
