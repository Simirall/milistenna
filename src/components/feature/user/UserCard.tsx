import { useGetUsersShow } from "@/apis/users/useGetUsersShow";
import { FediverseLogo } from "@phosphor-icons/react";
import {
  Avatar,
  Card,
  CardBody,
  HStack,
  Skeleton,
  Text,
  type Theme,
  VStack,
  useColorModeValue,
} from "@yamada-ui/react";
import type { FC, ReactElement } from "react";

export const UserCard: FC<{
  userId: string;
  clickAction?: () => void;
  endComponent?: ReactElement;
}> = ({ userId, clickAction, endComponent }) => {
  const { user, isLoading } = useGetUsersShow(userId);
  const hoverBg = useColorModeValue<Theme["colors"], Theme["colors"]>(
    "sky.50",
    "sky.950",
  );

  if (isLoading || !user) {
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
      width="full"
    >
      <CardBody>
        <HStack w="full">
          <Avatar
            src={user.avatarUrl ?? undefined}
            icon={<FediverseLogo fontSize="2rem" />}
          />
          <VStack gap="0" w="full" overflow="hidden">
            <Text isTruncated fontSize="xl">
              {user.name}
            </Text>
            <Text isTruncated>
              @{user.username}
              {user.host && `@${user.host}`}
            </Text>
          </VStack>
          {endComponent}
        </HStack>
      </CardBody>
    </Card>
  );
};

const CardSkeleton = () => {
  return (
    <Card>
      <CardBody>
        <Skeleton lineClamp={2} h={15} borderRadius="md" />
      </CardBody>
    </Card>
  );
};
