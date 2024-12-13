import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { GridCard } from "@/components/GridCard";
import { GridContainer } from "@/components/GridContainer";
import { LinkButton } from "@/components/LinkButton";
import { Loader } from "@/components/Loader";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Center, Container, Heading, Text } from "@yamada-ui/react";
import { CreateListModalButton } from "./-components/CreateListModal";

export const Route = createLazyFileRoute("/_auth/_layout/list/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Container px="10vw">
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
  const { data } = useGetUserListsList();

  if (!data) {
    return <Loader />;
  }

  if (data.length === 0) {
    return <Center>ありません</Center>;
  }

  return data.map((l) => (
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
