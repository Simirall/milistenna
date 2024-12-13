import { useGetUsersShow } from "@/apis/users/useGetUsersShow";
import { isError } from "@/utils/isError";
import { Card, CardBody, CardHeader, Text } from "@yamada-ui/react";
import type { FC } from "react";
import { CardSkeleton } from "./CardSkeleton";

export const UserCard: FC<{ userId: string }> = ({ userId }) => {
  const { data } = useGetUsersShow(userId)();

  if (!data || isError(data)) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>{data.name}</CardHeader>
      <CardBody>
        <Text>
          @{data.username}
          {data.host && `@${data.host}`}
        </Text>
      </CardBody>
    </Card>
  );
};
