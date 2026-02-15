import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { Endpoints } from "misskey-js";

const writeActions = [
  "antennas/create",
  "antennas/delete",
  "antennas/update",
  "users/lists/create",
  "users/lists/delete",
  "users/lists/pull",
  "users/lists/push",
  "users/lists/update",
] as const satisfies ReadonlyArray<keyof Endpoints>;

type WriteAction = (typeof writeActions)[number];

type InvalidateParams = {
  antennaId?: string;
  listId?: string;
};

export const invalidateQueriesAfterWrite = async (
  queryClient: QueryClient,
  action: WriteAction,
  params?: InvalidateParams,
) => {
  const invalidations: Array<Promise<void>> = [];

  const invalidate = (queryKey: readonly unknown[]) => {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey,
      }),
    );
  };

  switch (action) {
    case "antennas/create":
    case "antennas/delete":
    case "antennas/update": {
      invalidate(queryKeys.antennas.list);
      if (params?.antennaId) {
        invalidate(queryKeys.antennas.show(params.antennaId));
      }
      break;
    }
    case "users/lists/create": {
      invalidate(queryKeys.lists.list);
      break;
    }
    case "users/lists/delete": {
      invalidate(queryKeys.lists.list);
      invalidate(queryKeys.antennas.list);
      if (params?.listId) {
        invalidate(queryKeys.lists.show(params.listId));
      }
      break;
    }
    case "users/lists/push":
    case "users/lists/pull":
    case "users/lists/update": {
      invalidate(queryKeys.lists.list);
      if (params?.listId) {
        invalidate(queryKeys.lists.show(params.listId));
      }
      break;
    }
  }

  await Promise.all(invalidations);
};
