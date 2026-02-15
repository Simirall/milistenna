import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ConfirmModal } from "@/components/common/Confirm";
import { invalidateQueriesAfterWrite } from "@/utils/queryInvalidation";
import { writeApi } from "@/utils/writeApi";

type DeleteAntennaButtonProps = { antennaId: string; name: string };

export const DeleteAntennaButton = ({
  antennaId,
  name,
}: DeleteAntennaButtonProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleClicked = async () => {
    await writeApi("antennas/delete", {
      antennaId,
    });
    await invalidateQueriesAfterWrite(queryClient, "antennas/delete", {
      antennaId,
    });
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
