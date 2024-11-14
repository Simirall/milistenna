import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { Antenna } from "misskey-js/entities.js";

const endpoint = "antennas/list";

export const useGetAntennasList = () => {
  const { data, refetch } = useQuery<ReadonlyArray<Antenna>>({
    queryKey: [endpoint],
    queryFn: fetcher(endpoint),
  });

  return { data, refetch };
};
