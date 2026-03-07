import type { Antenna } from "misskey-js/entities.js";

export const antennaSourceLabels: Record<Antenna["src"], string> = {
  all: "すべての投稿",
  home: "ホーム？",
  list: "指定したリスト",
  users: "指定したユーザーの投稿",
  users_blacklist: "指定したユーザーを除いたすべて",
};

export const antennaSourceOptions: ReadonlyArray<{
  label: string;
  value: Antenna["src"];
}> = [
  { label: "すべての投稿", value: "all" },
  { label: "指定したユーザー", value: "users" },
  { label: "指定したユーザーを除外", value: "users_blacklist" },
  { label: "リスト", value: "list" },
];
