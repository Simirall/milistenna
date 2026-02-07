import { CaretLeftIcon } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Heading, VStack } from "@yamada-ui/react";
import type { Antenna } from "misskey-js/entities.js";
import { useGetAntennasShow } from "@/apis/antennas/useGetAntennasShow";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { Loader } from "@/components/common/Loader";
import { isError } from "@/utils/isError";
import { AntennaForm } from "./-components/AntennaForm";

export const Route = createLazyFileRoute("/_auth/antenna/$edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { edit } = Route.useParams();
  const isCreate = edit === "create";
  const { antenna } = useGetAntennasShow(edit);
  const { list } = useGetUsersListsShow(
    (!isCreate && antenna && !isError(antenna) && antenna.userListId) || "",
  );

  // 編集モードでデータ取得中はローダーを表示
  if (!isCreate && (!antenna || isError(antenna))) {
    return <Loader />;
  }

  // リストソースの場合、リスト名の取得を待つ
  const antennaData = isCreate ? undefined : (antenna as Antenna);
  const initialListName =
    antennaData?.src === "list" && list && !isError(list) ? list.name : "";

  return (
    <>
      <VStack>
        <Heading size="lg">
          {isCreate ? "アンテナ作成" : antennaData?.name}
        </Heading>
        <AntennaForm antenna={antennaData} initialListName={initialListName} />
      </VStack>
      <FloatLinkButton
        colorScheme="sky"
        linkProps={{
          to: "/antenna",
        }}
        position="left"
      >
        <CaretLeftIcon fontSize="1em" weight="bold" />
      </FloatLinkButton>
    </>
  );
}
