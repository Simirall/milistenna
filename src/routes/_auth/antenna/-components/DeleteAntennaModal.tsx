import { useNavigate } from "@tanstack/react-router";
import type { AntennasDeleteRequest } from "misskey-js/entities.js";
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { ConfirmModal } from "@/components/common/Confirm";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";

type DeleteAntennaButtonProps = { antennaId: string; name: string };

export const DeleteAntennaButton = ({
  antennaId,
  name,
}: DeleteAntennaButtonProps) => {
  const { refetch } = useGetAntennasList();
  const navigate = useNavigate();

  const handleClicked = async () => {
    await fetch(
      getApiUrl("antennas/delete"),
      getFetchObject<AntennasDeleteRequest>({ antennaId }),
    );
    await refetch();
    navigate({
      replace: true,
      to: "/antenna",
    });
  };

  return (
    <ConfirmModal
      button="削除"
      colorScheme="red"
      okText="削除"
      onAccept={handleClicked}
      title="アンテナを削除"
    >
      {name}を削除しますか？
    </ConfirmModal>
  );
};
