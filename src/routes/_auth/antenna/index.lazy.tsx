import { createLazyFileRoute } from "@tanstack/react-router";
import { Box, Center, Heading, Text } from "@yamada-ui/react";
import type { Antenna } from "misskey-js/entities.js";
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { LinkButton } from "@/components/common/LinkButton";
import { Loader } from "@/components/common/Loader";
import { GridCard } from "@/components/common/layout/GridCard";
import { GridContainer } from "@/components/common/layout/GridContainer";

export const Route = createLazyFileRoute("/_auth/antenna/")({
  component: RouteComponent,
});

const antennaSource: {
  [key in Antenna["src"]]: string;
} = {
  all: "すべての投稿",
  home: "ホーム？",
  list: "指定したリスト",
  users: "指定したユーザーの投稿",
  users_blacklist: "指定したユーザーを除いたすべて",
};

function RouteComponent() {
  return (
    <>
      <Box>
        <Heading textAlign="center">アンテナ一覧</Heading>
        <GridContainer>
          <AntennaList />
        </GridContainer>
      </Box>
      <FloatLinkButton
        colorScheme="emerald"
        linkProps={{ params: { edit: "create" }, to: "/antenna/$edit" }}
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
      colorScheme="emerald"
      footer={
        <LinkButton
          buttonProps={{ colorScheme: "lime", variant: "surface" }}
          linkProps={{ params: { edit: a.id }, to: "/antenna/$edit" }}
        >
          編集
        </LinkButton>
      }
      key={a.id}
      title={a.name}
    >
      <Text>ソース: {antennaSource[a.src]}</Text>
    </GridCard>
  ));
};
