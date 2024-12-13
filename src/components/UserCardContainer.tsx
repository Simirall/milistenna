import { VStack } from "@yamada-ui/react";
import type { FC } from "react";
import { UserCard } from "./UserCard";

export const UserCardContainer: FC<{ userIds: ReadonlyArray<string> }> = ({
  userIds,
}) => {
  return (
    <VStack>
      {userIds.map((u) => (
        <UserCard key={u} userId={u} />
      ))}
    </VStack>
  );
};
