import { queryOptions } from "@tanstack/react-query";
import type { Antenna, Error as MkError } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "antennas/list";

/**
 * アンテナ一覧を取得するためのクエリオプション
 * @returns アンテナ一覧を取得するためのクエリオプション
 */
export const antennasListQueryOptions = () =>
  queryOptions<ReadonlyArray<Antenna> | MkError>({
    queryFn: fetcher(endpoint),
    queryKey: [endpoint],
    ...defaultQueryConfig,
  });

/**
 * アンテナ一覧を取得するためのカスタムフック
 * @returns アンテナ一覧とクエリの状態
 */
export const useGetAntennasList = () => {
  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    antennasListQueryOptions(),
  );

  return {
    antennas: data,
    error,
    isApiError,
    isLoading,
    refetch,
  };
};
