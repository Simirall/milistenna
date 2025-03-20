import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { UserCard } from "@/components/domain/user/UserCard";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { Trash } from "@phosphor-icons/react";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import type { UsersListsPullRequest } from "misskey-js/entities.js";
import { type FC, useState } from "react";

const DeleteUserModal: FC<{
  open: boolean;
  onClose: () => void;
  listId: string;
  userId: string;
}> = ({ open, onClose, listId, userId }) => {
  const { refetch } = useGetUsersListsShow(listId);
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>ユーザーを削除</ModalHeader>
      <ModalBody py="sm">
        <Text>リストから削除しますか？</Text>
        <UserCard userId={userId} />
      </ModalBody>
      <ModalFooter>
        <Button
          size="lg"
          variant="solid"
          colorScheme="red"
          loading={isSubmitting}
          onClick={async () => {
            setSubmitting(true);
            await fetch(
              getApiUrl("users/lists/pull"),
              getFetchObject<UsersListsPullRequest>({ listId, userId }),
            );
            refetch();
          }}
        >
          <Text>削除</Text>
        </Button>
        <Button
          size="lg"
          variant="subtle"
          colorScheme="red"
          loading={isSubmitting}
          onClick={onClose}
        >
          <Text>キャンセル</Text>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export const DeleteUserButton: FC<{
  listId: string;
  userId: string;
}> = ({ listId, userId }) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        icon={<Trash fontSize="1.6em" />}
        colorScheme="red"
        variant="surface"
        onClick={onOpen}
      />
      <DeleteUserModal
        open={open}
        onClose={onClose}
        listId={listId}
        userId={userId}
      />
    </>
  );
};
