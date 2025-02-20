import { fetcher } from "@/utils/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Error as MkError, UserDetailed } from "misskey-js/entities.js";
import { useDebounce } from "use-debounce";

const endpoint = "users/search-by-username-and-host";

export const usersSearchByUsernameAndHostQueryOptions = (payload: {
  username: string;
  host: string | null;
}) =>
  queryOptions<ReadonlyArray<UserDetailed> | MkError>({
    queryKey: [endpoint, payload],
    queryFn: fetcher(endpoint, {
      username: payload.username,
      host: payload.host,
    }),
    enabled: !!payload.username,
  });

export const useGetUsersSearchByUsernameAndHost = (payload: {
  username: string;
  host: string | null;
}) => {
  const { data, refetch } = useQuery<ReadonlyArray<UserDetailed> | MkError>(
    usersSearchByUsernameAndHostQueryOptions(payload)
  );

  return { data, refetch };
};

export const useDebouncedGetUsersSearchByUsernameAndHost = (payload: {
  username: string;
  host: string | null;
}) => {
  const [username] = useDebounce(payload.username, 1000);
  const [host] = useDebounce(payload.host, 1000);

  const { data, refetch } = useGetUsersSearchByUsernameAndHost({
    username,
    host,
  });

  return { data, refetch };
};
