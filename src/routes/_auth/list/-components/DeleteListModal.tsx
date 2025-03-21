import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { ConfirmModal } from "@/components/common/Confirm";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { useNavigate } from "@tanstack/react-router";
import type { UsersListsDeleteRequest } from "misskey-js/entities.js";
import type { FC } from "react";

export const DeleteListButton: FC<{ listId: string; name: string }> = ({
  listId,
  name,
}) => {
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
