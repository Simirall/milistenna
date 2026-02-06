import { createLazyFileRoute } from "@tanstack/react-router";
import { Box, Center, Heading, HStack, Text } from "@yamada-ui/react";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { LinkButton } from "@/components/common/LinkButton";
import { Loader } from "@/components/common/Loader";
import { GridCard } from "@/components/common/layout/GridCard";
import { GridContainer } from "@/components/common/layout/GridContainer";
import { CreateListModalButton } from "./-components/CreateListModal";
import { DeleteListButton } from "./-components/DeleteListModal";

export const Route = createLazyFileRoute("/_auth/list/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Box>
        <Heading textAlign="center">リスト一覧</Heading>
        <GridContainer>
          <ListList />
        </GridContainer>
      </Box>
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
      colorScheme="sky"
      footer={
        <HStack>
          <LinkButton
            buttonProps={{
              colorScheme: "info",
              variant: "surface",
              flex: 1,
              size: "lg",
            }}
            linkProps={{ params: { edit: l.id }, to: "/list/$edit" }}
          >
            編集
          </LinkButton>
          <DeleteListButton listId={l.id} name={l.name} />
        </HStack>
      }
      key={l.id}
      title={l.name}
    >
      <Text>{l.userIds?.length}人のメンバー</Text>
    </GridCard>
  ));
};
