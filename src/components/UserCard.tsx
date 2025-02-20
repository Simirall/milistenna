import { useGetUsersShow } from "@/apis/users/useGetUsersShow";
import { isError } from "@/utils/isError";
import { FediverseLogo } from "@phosphor-icons/react";
import {
  Avatar,
  Card,
  CardBody,
  HStack,
  Text,
  type Theme,
  VStack,
  useColorModeValue,
} from "@yamada-ui/react";
import type { FC } from "react";
import { CardSkeleton } from "./CardSkeleton";

export const UserCard: FC<{ userId: string; clickAction?: () => void }> = ({
  userId,
  clickAction,
}) => {
  const { data } = useGetUsersShow(userId)();
  const hoverBg = useColorModeValue<Theme["colors"], Theme["colors"]>(
    "sky.50",
    "sky.950",
  );

  if (!data || isError(data)) {
    return <CardSkeleton />;
  }

  return (
    <Card
      {...(clickAction && {
        onClick: clickAction,
        cursor: "pointer",
        _hover: {
          backgroundColor: hoverBg,
        },
      })}
    >
      <CardBody>
        <HStack w="full">
          <Avatar
            src={data.avatarUrl ?? undefined}
            icon={<FediverseLogo fontSize="2rem" />}
          />
          <VStack gap="0" w="full" overflow="hidden">
            <Text isTruncated fontSize="xl">
              {data.name}
            </Text>
            <Text isTruncated>
              @{data.username}
              {data.host && `@${data.host}`}
            </Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};
