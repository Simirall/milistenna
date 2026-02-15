import { queryOptions } from "@tanstack/react-query";
import type { Error as MkError, UserList } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { apiEndpoints, queryKeys } from "@/utils/queryKeys";
import { useApiQuery } from "../useApiQuery";

/**
 * ユーザーリストの詳細情報を取得するためのクエリオプション
 * @param listId - 取得対象のリストID
 * @returns リスト詳細情報を取得するためのクエリオプション
 */
export const usersListsShowQueryOptions = (listId: string) =>
  queryOptions<UserList | MkError>({
    enabled: !!listId,
    queryFn: fetcher(apiEndpoints.usersListsShow, {
      listId,
    }),
    queryKey: queryKeys.lists.show(listId),
    ...defaultQueryConfig,
  });

/**
 * ユーザーリストの詳細情報を取得するためのカスタムフック
 * @param listId - 取得対象のリストID
 * @returns リスト詳細情報とクエリの状態
 */
export const useGetUsersListsShow = (listId: string) => {
  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    usersListsShowQueryOptions(listId),
  );

  return {
    error,
    isApiError,
    isLoading,
    list: data,
    refetch,
  };
};
