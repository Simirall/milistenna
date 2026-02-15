import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ConfirmModal } from "@/components/common/Confirm";
import { invalidateQueriesAfterWrite } from "@/utils/queryInvalidation";
import { writeApi } from "@/utils/writeApi";

type DeleteListButtonProps = { listId: string; name: string };

export const DeleteListButton = ({ listId, name }: DeleteListButtonProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleClicked = async () => {
    await writeApi("users/lists/delete", {
      listId,
    });
    await invalidateQueriesAfterWrite(queryClient, "users/lists/delete", {
      listId,
    });
    navigate({
      replace: true,
      to: "/list",
    });
  };

  return (
    <ConfirmModal
      button="削除"
      colorScheme="red"
      okText="削除"
      onAccept={handleClicked}
      title="リストを削除"
    >
      {name}を削除しますか？
    </ConfirmModal>
  );
};
