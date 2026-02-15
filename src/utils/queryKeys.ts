import type { Endpoints } from "misskey-js";

export const apiEndpoints = {
  antennasList: "antennas/list",
  antennasShow: "antennas/show",
  usersFollowing: "users/following",
  usersListsList: "users/lists/list",
  usersListsShow: "users/lists/show",
  usersSearchByUsernameAndHost: "users/search-by-username-and-host",
  usersShow: "users/show",
} as const satisfies Record<string, keyof Endpoints>;

type UserSearchPayload = {
  host: string | null;
  username: string;
};

export const queryKeys = {
  antennas: {
    list: [apiEndpoints.antennasList] as const,
    show: (antennaId: string) =>
      [apiEndpoints.antennasShow, antennaId] as const,
  },
  users: {
    following: (userId: string) =>
      [apiEndpoints.usersFollowing, userId] as const,
    searchByUsernameAndHost: (payload: UserSearchPayload) =>
      [apiEndpoints.usersSearchByUsernameAndHost, payload] as const,
    show: (userId: string) => [apiEndpoints.usersShow, userId] as const,
  },
  lists: {
    list: [apiEndpoints.usersListsList] as const,
    show: (listId: string) => [apiEndpoints.usersListsShow, listId] as const,
  },
} as const;
