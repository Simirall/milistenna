import { useNavigate } from "@tanstack/react-router";
import type { UsersListsDeleteRequest } from "misskey-js/entities.js";
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { ConfirmModal } from "@/components/common/Confirm";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";

type DeleteListButtonProps = { listId: string; name: string };

export const DeleteListButton = ({ listId, name }: DeleteListButtonProps) => {
  const { refetch } = useGetUserListsList();
  const { refetch: refetchAntennas } = useGetAntennasList();
  const navigate = useNavigate();

  const handleClicked = async () => {
    await fetch(
      getApiUrl("users/lists/delete"),
      getFetchObject<UsersListsDeleteRequest>({ listId }),
    );
    await Promise.all([refetch(), refetchAntennas()]);
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
