import { BroadcastIcon, ListDashesIcon } from "@phosphor-icons/react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, Text, VStack } from "@yamada-ui/react";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <VStack alignItems="center">
      <Card.Root colorScheme="sky" maxW="2xl" size="xl" variant="subtle">
        <Card.Header>リスト管理</Card.Header>
        <Card.Body>
          <p>リストの作成・編集・削除</p>
        </Card.Body>
        <Card.Footer alignSelf="end">
          <Button
            as={Link}
            colorScheme="sky"
            endIcon={<ListDashesIcon size="28" weight="fill" />}
            size="xl"
            to="/list"
          >
            <Text>リスト一覧</Text>
          </Button>
        </Card.Footer>
      </Card.Root>
      <Card.Root colorScheme="emerald" maxW="2xl" size="xl" variant="subtle">
        <Card.Header>アンテナ管理</Card.Header>
        <Card.Body>
          <p>アンテナの作成・編集・削除</p>
        </Card.Body>
        <Card.Footer alignSelf="end">
          <Button
            as={Link}
            colorScheme="emerald"
            endIcon={<BroadcastIcon size="28" weight="fill" />}
            size="xl"
            to="/antenna"
          >
            <Text>アンテナ一覧</Text>
          </Button>
        </Card.Footer>
      </Card.Root>
    </VStack>
  );
}
