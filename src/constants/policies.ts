export const policyKeys = {
  antennaLimit: "antennaLimit",
  userEachUserListsLimit: "userEachUserListsLimit",
  userListLimit: "userListLimit",
} as const;

export const limitMessages = {
  antennaCreateReached: (limit: number) =>
    `アンテナの作成上限（${limit}件）に達しています。`,
  antennaCreateAction:
    "新しいアンテナを作成するには、既存のアンテナを削除してください。",
  listCreateReached: (limit: number) =>
    `リストの作成上限（${limit}件）に達しています。`,
  listCreateAction:
    "新しいリストを作成するには、既存のリストを削除してください。",
  listMemberReached: (limit: number) =>
    `このリストのユーザー数上限（${limit}人）に達しています。`,
  listMemberAction:
    "新しいユーザーを追加するには、既存のユーザーを削除してください。",
} as const;

export const commonDisplayLabels = {
  empty: "ありません",
} as const;
