import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { LinkButton } from "@/components/common/LinkButton";
import { Loader } from "@/components/common/Loader";
import { GridCard } from "@/components/layout/GridCard";
import { GridContainer } from "@/components/layout/GridContainer";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Center, Container, Heading, Text } from "@yamada-ui/react";
import type { Antenna } from "misskey-js/entities.js";

export const Route = createLazyFileRoute("/_auth/antenna/")({
  component: RouteComponent,
});

const antennaSource: {
  [key in Antenna["src"]]: string;
} = {
  home: "ホーム？",
  all: "すべての投稿",
  users: "指定したユーザーの投稿",
  users_blacklist: "指定したユーザーを除いたすべて",
  list: "指定したリスト",
};

function RouteComponent() {
  return (
    <>
      <Container>
        <Heading textAlign="center">アンテナ一覧</Heading>
        <GridContainer>
          <AntennaList />
        </GridContainer>
      </Container>
      <FloatLinkButton
        colorScheme="violet"
        linkProps={{ to: "/antenna/$edit", params: { edit: "create" } }}
      />
    </>
  );
}

const AntennaList = () => {
  const { antennas } = useGetAntennasList();

  if (!antennas) {
    return <Loader />;
  }

  if (antennas.length === 0) {
    return <Center>ありません</Center>;
  }

  return antennas.map((a) => (
    <GridCard
      key={a.id}
      title={a.name}
      colorScheme="violet"
      footer={
        <LinkButton
          linkProps={{ to: "/antenna/$edit", params: { edit: a.id } }}
          buttonProps={{ colorScheme: "purple", variant: "surface" }}
        >
          編集
        </LinkButton>
      }
    >
      <Text>ソース: {antennaSource[a.src]}</Text>
    </GridCard>
  ));
};
