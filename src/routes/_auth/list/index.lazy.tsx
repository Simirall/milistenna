import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { LinkButton } from "@/components/common/LinkButton";
import { Loader } from "@/components/common/Loader";
import { GridCard } from "@/components/layout/GridCard";
import { GridContainer } from "@/components/layout/GridContainer";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Center, Container, Heading, Text } from "@yamada-ui/react";
import { CreateListModalButton } from "./-components/CreateListModal";

export const Route = createLazyFileRoute("/_auth/list/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Container>
        <Heading textAlign="center">リスト一覧</Heading>
        <GridContainer>
          <ListList />
        </GridContainer>
      </Container>
      <CreateListModalButton />
    </>
  );
}

const ListList = () => {
  const { lists } = useGetUserListsList();

  if (!lists) {
    return <Loader />;
  }

  if (lists.length === 0) {
    return <Center>ありません</Center>;
  }

  return lists.map((l) => (
    <GridCard
      key={l.id}
      title={l.name}
      colorScheme="sky"
      footer={
        <LinkButton
          linkProps={{ to: "/list/$edit", params: { edit: l.id } }}
          buttonProps={{ colorScheme: "cyan", variant: "surface" }}
        >
          編集
        </LinkButton>
      }
    >
      <Text>{l.userIds?.length}人のメンバー</Text>
    </GridCard>
  ));
};
