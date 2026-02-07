import { FediverseLogoIcon } from "@phosphor-icons/react";
import {
  Avatar,
  Card,
  HStack,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@yamada-ui/react";
import { MfmSimple } from "mfm-react-render";
import type { ReactElement } from "react";
import { useGetUsersShow } from "@/apis/users/useGetUsersShow";
import { useLoginStore } from "@/store/login";

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
  const instanceEmojis = useLoginStore((s) => s.instanceEmojis);
  const hoverBg = useColorModeValue("sky.50", "sky.950");

  if (isLoading || !user) {
    return <CardSkeleton />;
  }

  return (
    <Card.Root
      {...(clickAction && {
        _hover: {
          backgroundColor: hoverBg,
        },
        cursor: "pointer",
        onClick: clickAction,
      })}
      width="full"
    >
      <Card.Body>
        <HStack minW={0} w="full">
          <Avatar
            icon={<FediverseLogoIcon fontSize="2rem" />}
            src={user.avatarUrl ?? undefined}
          />
          <VStack gap="0" minW={0} overflow="hidden" w="full">
            <Text
              fontSize="xl"
              truncated
              css={{
                img: {
                  verticalAlign: "middle",
                },
              }}
            >
              <MfmSimple
                emojis={user.host ? user.emojis : instanceEmojis}
                text={user.name ?? user.username}
              />
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
        <Skeleton borderRadius="md" h={15} lineClamp={2} />
      </Card.Body>
    </Card.Root>
  );
};
