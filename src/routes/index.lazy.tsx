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
        size="xl"
        colorScheme="sky"
        variant="subtle"
        endIcon={<ListDashesIcon weight="fill" size="28" />}
        as={Link}
        to="/list"
      >
        <Text>リスト一覧</Text>
      </Button>
      <Button
        size="xl"
        colorScheme="violet"
        variant="subtle"
        endIcon={<BroadcastIcon weight="fill" size="28" />}
        as={Link}
        to="/antenna"
      >
        <Text>アンテナ一覧</Text>
      </Button>
    </HStack>
  );
}
