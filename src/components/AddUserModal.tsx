import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { useDebouncedGetUsersSearchByUsernameAndHost } from "@/apis/users/useGetUsersSearchByUsernameAndHost";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { At, Plus } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import {
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  VStack,
  useDisclosure,
} from "@yamada-ui/react";
import type { UsersListsPushRequest } from "misskey-js/entities.js";
import { type FC, useState } from "react";
import { Loader } from "./Loader";
import { UserCard } from "./UserCard";

const addUserToList = async (payload: UsersListsPushRequest) => {
  await fetch(
    getApiUrl("users/lists/push"),
    getFetchObject<UsersListsPushRequest>(payload),
  );
};

const AddUserModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState("");
  const [host, setHost] = useState("");

  const { edit } = useParams({ strict: false });
  const { refetch } = useGetUsersListsShow(edit ?? "");

  const { users, isLoading } = useDebouncedGetUsersSearchByUsernameAndHost({
    username,
    host,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setUsername("");
        setHost("");
      }}
      size="xl"
      placement="top"
    >
      <ModalHeader>ユーザーを検索</ModalHeader>
      <ModalBody p="md">
        <HStack gap="sm">
          <InputGroup>
            <InputLeftAddon>
              <At />
            </InputLeftAddon>
            <Input
              autoFocus
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>
              <At />
            </InputLeftAddon>
            <Input
              enterKeyHint="done"
              onChange={(e) => {
                setHost(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
            />
          </InputGroup>
        </HStack>
        {(username || host) && isLoading && (
          <Center w="full">
            <Loader />
          </Center>
        )}
        {users &&
          (users.length === 0 ? (
            <Text>いません</Text>
          ) : (
            <VStack>
              {users.map((u) => (
                <UserCard
                  key={u.id}
                  userId={u.id}
                  clickAction={async () => {
                    if (edit) {
                      await addUserToList({
                        userId: u.id,
                        listId: edit,
                      });
                      await refetch();
                      onClose();
                    }
                  }}
                />
              ))}
            </VStack>
          ))}
      </ModalBody>
    </Modal>
  );
};

export const AddUserModalButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        leftIcon={<Plus />}
        onClick={onOpen}
        colorScheme="cyan"
        variant="surface"
        size="lg"
      >
        追加
      </Button>
      <AddUserModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
