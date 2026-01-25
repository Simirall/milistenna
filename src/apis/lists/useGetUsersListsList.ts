import { queryOptions } from "@tanstack/react-query";
import type { Error as MkError, UserList } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "users/lists/list";

/**
 * ユーザーリスト一覧を取得するためのクエリオプション
 * @returns ユーザーリスト一覧を取得するためのクエリオプション
 */
export const usersListsListQueryOptions = () =>
  queryOptions<ReadonlyArray<UserList> | MkError>({
    queryFn: fetcher(endpoint),
    queryKey: [endpoint],
    ...defaultQueryConfig,
  });

/**
 * ユーザーリスト一覧を取得するためのカスタムフック
 * @returns ユーザーリスト一覧とクエリの状態
 */
export const useGetUserListsList = () => {
  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    usersListsListQueryOptions(),
  );

  return {
    error,
    isApiError,
    isLoading,
    lists: data,
    refetch,
  };
};
