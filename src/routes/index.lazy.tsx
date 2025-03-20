import { Broadcast, ListDashes } from "@phosphor-icons/react";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Button, HStack, Text } from "@yamada-ui/react";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HStack>
        <Button
          size="xl"
          colorScheme="sky"
          variant="subtle"
          endIcon={<ListDashes weight="fill" size="28" />}
          as={Link}
          to="/list"
        >
          <Text>リスト一覧</Text>
        </Button>
        <Button
          size="xl"
          colorScheme="violet"
          variant="subtle"
          endIcon={<Broadcast weight="fill" size="28" />}
          as={Link}
          to="/antenna"
        >
          <Text>アンテナ一覧</Text>
        </Button>
      </HStack>
    </>
  );
}
