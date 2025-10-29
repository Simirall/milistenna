import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { ConfirmModal } from "@/components/common/Confirm";
import { UserCard } from "@/components/feature/user/UserCard";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { Trash } from "@phosphor-icons/react";
import { Text } from "@yamada-ui/react";
import type { UsersListsPullRequest } from "misskey-js/entities.js";

type DeleteUserButtonProps = {
  listId: string;
  userId: string;
};

export const DeleteUserButton = ({ listId, userId }: DeleteUserButtonProps) => {
  const { refetch } = useGetUsersListsShow(listId);

  const handleClicked = async () => {
    await fetch(
      getApiUrl("users/lists/pull"),
      getFetchObject<UsersListsPullRequest>({ listId, userId }),
    );
    refetch();
  };

  return (
    <>
      <ConfirmModal
        button={<Trash fontSize="1.6em" />}
        colorScheme="red"
        onAccept={handleClicked}
        title="ユーザーを削除"
        okText="削除"
      >
        <Text>リストから削除しますか？</Text>
        <UserCard userId={userId} />
      </ConfirmModal>
    </>
  );
};
