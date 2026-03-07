import { CaretLeftIcon, PlusIcon } from "@phosphor-icons/react";
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
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { LimitAlert } from "@/components/common/LimitAlert";
import { LinkButton } from "@/components/common/LinkButton";
import { Loader } from "@/components/common/Loader";
import { GridCard } from "@/components/common/layout/GridCard";
import { GridContainer } from "@/components/common/layout/GridContainer";
import { antennaSourceLabels } from "@/constants/antennas";
import {
  commonDisplayLabels,
  limitMessages,
  policyKeys,
} from "@/constants/policies";
import { useLoginStore } from "@/store/login";
import { CopyAntennaButton } from "./-components/CopyAntennaModal";
import { DeleteAntennaButton } from "./-components/DeleteAntennaModal";
import { ExternalLinkButton } from "@/components/common/ExternalLinkButton";

export const Route = createLazyFileRoute("/_auth/antenna/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mySelf } = useLoginStore();
  const { antennas } = useGetAntennasList();
  const { open, onOpen, onClose } = useDisclosure();

  const antennaLimit = mySelf?.policies[policyKeys.antennaLimit] ?? 0;
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
              {limitMessages.antennaCreateReached(antennaLimit)}
              {limitMessages.antennaCreateAction}
            </Text>
          </LimitAlert>
        </>
      ) : (
        <FloatLinkButton
          colorScheme="emerald"
          linkProps={{ params: { edit: "create" }, to: "/antenna/$edit" }}
        />
      )}
      <FloatLinkButton
        colorScheme="emerald"
        linkProps={{
          to: "/",
        }}
        position="left"
      >
        <CaretLeftIcon fontSize="1em" weight="bold" />
      </FloatLinkButton>
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
    return <Center>{commonDisplayLabels.empty}</Center>;
  }

  return antennas.map((a) => (
    <GridCard
      colorScheme="emerald"
      footer={
        <HStack wrap="wrap">
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
      <Text>ソース: {antennaSourceLabels[a.src]}</Text>
    </GridCard>
  ));
};
