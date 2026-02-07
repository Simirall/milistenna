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
        <Card.Header fontSize="4xl" fontWeight="bold">
          リスト管理
        </Card.Header>
        <Card.Body fontSize="xl">
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
            <Text fontWeight="bold">リスト一覧</Text>
          </Button>
        </Card.Footer>
      </Card.Root>
      <Card.Root colorScheme="emerald" maxW="2xl" size="xl" variant="subtle">
        <Card.Header fontSize="4xl" fontWeight="bold">
          アンテナ管理
        </Card.Header>
        <Card.Body fontSize="xl">
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
            <Text fontWeight="bold">アンテナ一覧</Text>
          </Button>
        </Card.Footer>
      </Card.Root>
    </VStack>
  );
}
