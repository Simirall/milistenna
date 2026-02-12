import { TrashIcon } from "@phosphor-icons/react";
import { Text } from "@yamada-ui/react";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { ConfirmModal } from "@/components/common/Confirm";
import { UserCard } from "@/components/domain/user/UserCard";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { writeApi } from "@/utils/writeApi";

type DeleteUserButtonProps = {
  listId: string;
  userId: string;
};

export const DeleteUserButton = ({ listId, userId }: DeleteUserButtonProps) => {
  const { refetch } = useGetUsersListsShow(listId);
  const { refetch: refetchList } = useGetUserListsList();

  const handleClicked = async () => {
    await writeApi("users/lists/pull", {
      listId,
      userId,
    });
    await Promise.all([refetch(), refetchList()]);
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
