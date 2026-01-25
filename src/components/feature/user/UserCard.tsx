import { FediverseLogo } from "@phosphor-icons/react";
import {
  Avatar,
  Card,
  HStack,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@yamada-ui/react";
import type { ReactElement } from "react";
import { useGetUsersShow } from "@/apis/users/useGetUsersShow";

type UserCardProps = {
  userId: string;
  clickAction?: () => void;
  endComponent?: ReactElement;
};

export const UserCard = ({
  userId,
  clickAction,
  endComponent,
}: UserCardProps) => {
  const { user, isLoading } = useGetUsersShow(userId);
  const hoverBg = useColorModeValue("sky.50", "sky.950");

  if (isLoading || !user) {
    return <CardSkeleton />;
  }

  return (
    <Card.Root
      {...(clickAction && {
        onClick: clickAction,
        cursor: "pointer",
        _hover: {
          backgroundColor: hoverBg,
        },
      })}
      width="full"
    >
      <Card.Body>
        <HStack w="full">
          <Avatar
            src={user.avatarUrl ?? undefined}
            icon={<FediverseLogo fontSize="2rem" />}
          />
          <VStack gap="0" w="full" overflow="hidden">
            <Text truncated fontSize="xl">
              {user.name}
            </Text>
            <Text truncated>
              @{user.username}
              {user.host && `@${user.host}`}
            </Text>
          </VStack>
          {endComponent}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

const CardSkeleton = () => {
  return (
    <Card.Root>
      <Card.Body>
        <Skeleton lineClamp={2} h={15} borderRadius="md" />
      </Card.Body>
    </Card.Root>
  );
};
