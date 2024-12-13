import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { useNavigate } from "@tanstack/react-router";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import type { UsersListsDeleteRequest } from "misskey-js/entities.js";
import { type FC, useState } from "react";

const DeleteListModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  name: string;
}> = ({ isOpen, onClose, listId, name }) => {
  const { refetch } = useGetUserListsList();
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>リストを削除</ModalHeader>
      <ModalBody>
        <Text>{name}を削除しますか？</Text>
      </ModalBody>
      <ModalFooter>
        <Button
          size="lg"
          variant="surface"
          colorScheme="red"
          isLoading={isSubmitting}
          onClick={async () => {
            setSubmitting(true);
            await fetch(
              getApiUrl("users/lists/delete"),
              getFetchObject<UsersListsDeleteRequest>({ listId }),
            );
            await refetch();
            navigate({
              to: "/list",
              replace: true,
            });
          }}
        >
          削除
        </Button>
        <Button
          size="lg"
          variant="subtle"
          colorScheme="neutral"
          isLoading={isSubmitting}
          onClick={onClose}
        >
          キャンセル
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export const DeleteListButton: FC<{ listId: string; name: string }> = ({
  listId,
  name,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button size="lg" variant="surface" colorScheme="red" onClick={onOpen}>
        削除
      </Button>
      <DeleteListModal
        isOpen={isOpen}
        onClose={onClose}
        listId={listId}
        name={name}
      />
    </>
  );
};