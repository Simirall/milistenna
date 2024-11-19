import { fetcher } from "@/utils/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Antenna, Error as MkError } from "misskey-js/entities.js";

const endpoint = "antennas/show";

export const antennaShowQueryOptions = (antennaId: string) =>
  queryOptions<Antenna | MkError>({
    queryKey: [`${endpoint}${antennaId}`],
    queryFn: fetcher(endpoint, {
      antennaId,
    }),
    enabled: !!antennaId,
  });

export const useGetAntennasShow = (antennaId: string) => () => {
  const { data, refetch } = useQuery<Antenna | MkError>(
    antennaShowQueryOptions(antennaId),
  );

  return { data, refetch };
};
