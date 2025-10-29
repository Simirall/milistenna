import { useNavigate } from "@tanstack/react-router";
import type { UsersListsDeleteRequest } from "misskey-js/entities.js";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { ConfirmModal } from "@/components/common/Confirm";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";

type DeleteListButtonProps = { listId: string; name: string };

export const DeleteListButton = ({ listId, name }: DeleteListButtonProps) => {
  const { refetch } = useGetUserListsList();
  const navigate = useNavigate();

  const handleClicked = async () => {
    await fetch(
      getApiUrl("users/lists/delete"),
      getFetchObject<UsersListsDeleteRequest>({ listId }),
    );
    await refetch();
    navigate({
      to: "/list",
      replace: true,
    });
  };

  return (
    <ConfirmModal
      button="削除"
      colorScheme="red"
      onAccept={handleClicked}
      title="リストを削除"
      okText="削除"
    >
      {name}を削除しますか？
    </ConfirmModal>
  );
};
