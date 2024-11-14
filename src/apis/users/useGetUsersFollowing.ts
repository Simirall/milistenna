import { useLoginStore } from "@/store/login";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { UserList } from "misskey-js/entities.js";

const endpoint = "users/following";

export const useGetUsersFollowing = () => {
  const { data, refetch } = useQuery<ReadonlyArray<UserList>>({
    queryKey: [endpoint],
    queryFn: fetcher(endpoint, {
      limit: 10,
      userId: useLoginStore.getState().mySelf?.id,
    }),
  });

  return { data, refetch };
};
