import { PlusIcon } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import { Button, Text, useDisclosure } from "@yamada-ui/react";
import type {
  UserDetailed,
  UsersListsPushRequest,
} from "misskey-js/entities.js";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { UserSearchModal } from "@/components/domain/user/UserSearchModal";
import { reportInternalError } from "@/utils/appError";
import { writeApi } from "@/utils/writeApi";

const addUserToList = async (payload: UsersListsPushRequest) => {
  await writeApi("users/lists/push", payload);
};

type AddUserModalProps = { open: boolean; onClose: () => void };

const AddUserModal = ({ open, onClose }: AddUserModalProps) => {
  const { edit } = useParams({ strict: false });
  const { refetch } = useGetUsersListsShow(edit ?? "");
  const { refetch: refetchList } = useGetUserListsList();

  const handleUserSelect = async (user: UserDetailed) => {
    if (edit) {
      try {
        await addUserToList({
          listId: edit,
          userId: user.id,
        });
        await Promise.all([refetch(), refetchList()]);
      } catch (error) {
        reportInternalError("list-add-user", error);
      }
    }
  };

  return (
    <UserSearchModal
      onClose={onClose}
      onUserSelect={handleUserSelect}
      open={open}
    />
  );
};

export const AddUserModalButton = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        colorScheme="cyan"
        onClick={onOpen}
        size="lg"
        startIcon={<PlusIcon weight="bold" />}
        variant="surface"
      >
        <Text>ユーザーを追加</Text>
      </Button>
      <AddUserModal onClose={onClose} open={open} />
    </>
  );
};
