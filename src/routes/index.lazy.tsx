import { BroadcastIcon, ListDashesIcon } from "@phosphor-icons/react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button, HStack, Text } from "@yamada-ui/react";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <HStack>
      <Button
        as={Link}
        colorScheme="sky"
        endIcon={<ListDashesIcon size="28" weight="fill" />}
        size="xl"
        to="/list"
        variant="subtle"
      >
        <Text>リスト一覧</Text>
      </Button>
      <Button
        as={Link}
        colorScheme="emerald"
        endIcon={<BroadcastIcon size="28" weight="fill" />}
        size="xl"
        to="/antenna"
        variant="subtle"
      >
        <Text>アンテナ一覧</Text>
      </Button>
    </HStack>
  );
}
