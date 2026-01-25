import { queryOptions } from "@tanstack/react-query";
import type { Error as MkError, UserList } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "users/lists/show";

/**
 * ユーザーリストの詳細情報を取得するためのクエリオプション
 * @param listId - 取得対象のリストID
 * @returns リスト詳細情報を取得するためのクエリオプション
 */
export const usersListsShowQueryOptions = (listId: string) =>
  queryOptions<UserList | MkError>({
    enabled: !!listId,
    queryFn: fetcher(endpoint, {
      listId,
    }),
    queryKey: [endpoint, listId],
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
