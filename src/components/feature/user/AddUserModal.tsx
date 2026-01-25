import { At, MagnifyingGlassPlus, Plus } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import {
  Button,
  Center,
  Field,
  HStack,
  Input,
  InputGroup,
  Modal,
  Text,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import type { UsersListsPushRequest } from "misskey-js/entities.js";
import { useState } from "react";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { useDebouncedGetUsersSearchByUsernameAndHost } from "@/apis/users/useGetUsersSearchByUsernameAndHost";
import { EmptyState } from "@/components/common/EmptyState";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { Loader } from "../../common/Loader";
import { UserCard } from "./UserCard";

const addUserToList = async (payload: UsersListsPushRequest) => {
  await fetch(
    getApiUrl("users/lists/push"),
    getFetchObject<UsersListsPushRequest>(payload),
  );
};

type AddUserModalProps = { open: boolean; onClose: () => void };

const AddUserModal = ({ open, onClose }: AddUserModalProps) => {
  const [username, setUsername] = useState("");
  const [host, setHost] = useState("");

  const { edit } = useParams({ strict: false });
  const { refetch } = useGetUsersListsShow(edit ?? "");

  const handleUserSelect = async (userId: string) => {
    if (edit) {
      await addUserToList({
        userId,
        listId: edit,
      });
      await refetch();
      setUsername("");
      setHost("");
      onClose();
    }
  };

  return (
    <Modal.Root
      open={open}
      onClose={() => {
        onClose();
        setUsername("");
        setHost("");
      }}
      size="xl"
      placement="center"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>ユーザーを検索</Modal.Header>
        <Modal.Body>
          <UserSearchForm setUsername={setUsername} setHost={setHost} />
          <UserSearchResult
            username={username}
            host={host}
            onUserClick={handleUserSelect}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export const AddUserModalButton = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        startIcon={<Plus weight="bold" />}
        onClick={onOpen}
        colorScheme="cyan"
        variant="surface"
        size="lg"
      >
        <Text>ユーザーを追加</Text>
      </Button>
      <AddUserModal open={open} onClose={onClose} />
    </>
  );
};

type UserSearchFormProps = {
  setUsername: (username: string) => void;
  setHost: (host: string) => void;
};

const UserSearchForm = ({ setUsername, setHost }: UserSearchFormProps) => {
  return (
    <HStack gap="sm">
      <Field.Root>
        <Field.Label>ユーザー名</Field.Label>
        <InputGroup.Root>
          <InputGroup.Addon>
            <At />
          </InputGroup.Addon>
          <Input
            autoFocus
            placeholder="username"
            autoComplete="none"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </InputGroup.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>ホスト</Field.Label>
        <InputGroup.Root>
          <InputGroup.Addon>
            <At />
          </InputGroup.Addon>
          <Input
            placeholder="misskey.example"
            autoComplete="off"
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
        </InputGroup.Root>
      </Field.Root>
    </HStack>
  );
};

type UserSearchResultProps = {
  username: string;
  host: string;
  onUserClick: (userId: string) => Promise<void>;
};

const UserSearchResult = ({
  username,
  host,
  onUserClick,
}: UserSearchResultProps) => {
  const { users, isLoading } = useDebouncedGetUsersSearchByUsernameAndHost({
    username,
    host,
  });

  // ローディング状態
  if ((username || host) && isLoading) {
    return (
      <Center w="full" py="6">
        <Loader />
      </Center>
    );
  }

  // 初期状態: 検索語が未入力の場合
  if ((!username && !host) || !users) {
    return <EmptyState icon={<MagnifyingGlassPlus />} />;
  }

  // 検索結果がない場合
  if (users.length === 0) {
    return <EmptyState title="ユーザーが見つかりません" />;
  }

  // 検索結果がある場合
  return (
    <VStack mt="4" w="full" gap="2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          userId={user.id}
          clickAction={async () => {
            await onUserClick(user.id);
          }}
        />
      ))}
    </VStack>
  );
};
