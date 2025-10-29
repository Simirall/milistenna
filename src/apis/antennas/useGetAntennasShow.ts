import { queryOptions } from "@tanstack/react-query";
import type { Antenna, Error as MkError } from "misskey-js/entities.js";
import { fetcher } from "@/utils/fetcher";
import { defaultQueryConfig } from "@/utils/queryConfig";
import { useApiQuery } from "../useApiQuery";

const endpoint = "antennas/show";

/**
 * アンテナの詳細情報を取得するためのクエリオプション
 * @param antennaId - 取得対象のアンテナID
 * @returns アンテナ詳細情報を取得するためのクエリオプション
 */
export const antennaShowQueryOptions = (antennaId: string) =>
  queryOptions<Antenna | MkError>({
    queryKey: [endpoint, antennaId],
    queryFn: fetcher(endpoint, {
      antennaId,
    }),
    enabled: !!antennaId,
    ...defaultQueryConfig,
  });

/**
 * アンテナの詳細情報を取得するためのカスタムフック
 * @param antennaId - 取得対象のアンテナID
 * @returns アンテナの詳細情報とクエリの状態
 */
export const useGetAntennasShow = (antennaId: string) => {
  const { data, isLoading, error, refetch, isApiError } = useApiQuery(
    antennaShowQueryOptions(antennaId),
  );

  return {
    antenna: data,
    isLoading,
    isApiError,
    error,
    refetch,
  };
};
