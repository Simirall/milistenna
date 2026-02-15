import { TrashIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { Text } from "@yamada-ui/react";
import { ConfirmModal } from "@/components/common/Confirm";
import { UserCard } from "@/components/domain/user/UserCard";
import { invalidateQueriesAfterWrite } from "@/utils/queryInvalidation";
import { writeApi } from "@/utils/writeApi";

type DeleteUserButtonProps = {
  listId: string;
  userId: string;
};

export const DeleteUserButton = ({ listId, userId }: DeleteUserButtonProps) => {
  const queryClient = useQueryClient();

  const handleClicked = async () => {
    await writeApi("users/lists/pull", {
      listId,
      userId,
    });
    await invalidateQueriesAfterWrite(queryClient, "users/lists/pull", {
      listId,
    });
  };

  return (
    <ConfirmModal
      button={<TrashIcon fontSize="1.2em" />}
      colorScheme="red"
      okText="削除"
      onAccept={handleClicked}
      title="ユーザーを削除"
    >
      <Text>リストから削除しますか？</Text>
      <UserCard userId={userId} />
    </ConfirmModal>
  );
};
