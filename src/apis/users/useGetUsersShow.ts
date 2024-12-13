import { fetcher } from "@/utils/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Error as MkError, UserDetailed } from "misskey-js/entities.js";

const endpoint = "users/show";

export const usersShowQueryOptions = (userId: string) =>
  queryOptions<UserDetailed | MkError>({
    queryKey: [`${endpoint}${userId}`],
    queryFn: fetcher(endpoint, {
      userId,
    }),
    enabled: !!userId,
  });

export const useGetUsersShow = (userId: string) => () => {
  const { data, refetch } = useQuery<UserDetailed | MkError>(
    usersShowQueryOptions(userId),
  );

  return { data, refetch };
};
