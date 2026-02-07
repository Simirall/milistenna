import { PlusIcon } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Box,
  Center,
  Heading,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import type { Antenna } from "misskey-js/entities.js";
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { LimitAlert } from "@/components/common/LimitAlert";
import { LinkButton } from "@/components/common/LinkButton";
import { Loader } from "@/components/common/Loader";
import { GridCard } from "@/components/common/layout/GridCard";
import { GridContainer } from "@/components/common/layout/GridContainer";
import { useLoginStore } from "@/store/login";
import { CopyAntennaButton } from "./-components/CopyAntennaModal";
import { DeleteAntennaButton } from "./-components/DeleteAntennaModal";
import { ExternalLinkButton } from "@/components/common/ExternalLinkButton";

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
  const { mySelf } = useLoginStore();
  const { antennas } = useGetAntennasList();
  const { open, onOpen, onClose } = useDisclosure();

  const antennaLimit = mySelf?.policies.antennaLimit ?? 0;
  const isLimitReached = (antennas?.length ?? 0) >= antennaLimit;

  return (
    <>
      <title>アンテナ一覧 | Milistenna</title>
      <Box>
        <Heading textAlign="center">アンテナ一覧</Heading>
        <GridContainer>
          <AntennaList />
        </GridContainer>
      </Box>
      {isLimitReached ? (
        <>
          <IconButton
            borderRadius="full"
            bottom="xl"
            colorScheme="emerald"
            onClick={onOpen}
            pos="fixed"
            right={{ base: "calc(20vw + 1rem)", md: "xl" }}
            shadow="md"
            size="xl"
          >
            <PlusIcon fontSize="1.6rem" weight="bold" />
          </IconButton>
          <LimitAlert onClose={onClose} open={open}>
            <Text>
              アンテナの作成上限（{antennaLimit}件）に達しています。
              新しいアンテナを作成するには、既存のアンテナを削除してください。
            </Text>
          </LimitAlert>
        </>
      ) : (
        <FloatLinkButton
          colorScheme="emerald"
          linkProps={{ params: { edit: "create" }, to: "/antenna/$edit" }}
        />
      )}
    </>
  );
}

const AntennaList = () => {
  const { antennas } = useGetAntennasList();
  const { instance } = useLoginStore();

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
        <HStack>
          <ExternalLinkButton
            colorScheme="amber"
            href={`https://${instance}/timeline/antenna/${a.id}`}
          >
            開く
          </ExternalLinkButton>
          <LinkButton
            buttonProps={{
              colorScheme: "sky",
              variant: "surface",
              flex: 1,
              size: "lg",
            }}
            linkProps={{ params: { edit: a.id }, to: "/antenna/$edit" }}
          >
            編集
          </LinkButton>
          <CopyAntennaButton antenna={a} />
          <DeleteAntennaButton antennaId={a.id} name={a.name} />
        </HStack>
      }
      key={a.id}
      title={a.name}
    >
      <Text>ソース: {antennaSource[a.src]}</Text>
    </GridCard>
  ));
};
