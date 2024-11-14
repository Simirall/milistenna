import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { UserList } from "misskey-js/entities.js";

const endpoint = "users/lists/list";

export const useGetUserListsList = () => {
  const { data, refetch } = useQuery<ReadonlyArray<UserList>>({
    queryKey: [endpoint],
    queryFn: fetcher(endpoint),
  });

  return { data, refetch };
};
