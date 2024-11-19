import { fetcher } from "@/utils/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Error as MkError, UserList } from "misskey-js/entities.js";

const endpoint = "users/lists/show";

export const usersListsShowQueryOptions = (listId: string) =>
  queryOptions<UserList | MkError>({
    queryKey: [`${endpoint}${listId}`],
    queryFn: fetcher(endpoint, {
      listId,
    }),
    enabled: !!listId,
  });

export const useGetUsersListsShow = (listId: string) => () => {
  const { data, refetch } = useQuery<UserList | MkError>(
    usersListsShowQueryOptions(listId),
  );

  return { data, refetch };
};
