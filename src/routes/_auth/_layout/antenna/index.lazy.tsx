import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { FloatLinkButton } from "@/components/FloatLinkButton";
import { GridCard } from "@/components/GridCard";
import { GridContainer } from "@/components/GridContainer";
import { LinkButton } from "@/components/LinkButton";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Container, Heading, Text } from "@yamada-ui/react";
import type { Antenna } from "misskey-js/entities.js";

export const Route = createLazyFileRoute("/_auth/_layout/antenna/")({
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
  const { data } = useGetAntennasList();

  return (
    <>
      <Container px="10vw">
        <Heading textAlign="center">アンテナ一覧</Heading>
        <GridContainer>
          {data &&
            data.length > 0 &&
            data.map((a) => (
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
            ))}
        </GridContainer>
      </Container>
      <FloatLinkButton
        colorScheme="violet"
        linkProps={{ to: "/antenna/$edit", params: { edit: "create" } }}
      />
    </>
  );
}
