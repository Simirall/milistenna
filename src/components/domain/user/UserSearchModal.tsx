import { At, AtIcon, MagnifyingGlassPlusIcon } from "@phosphor-icons/react";
import {
  Center,
  Field,
  HStack,
  Input,
  InputGroup,
  Modal,
  VStack,
} from "@yamada-ui/react";
import type { UserDetailed } from "misskey-js/entities.js";
import { useState } from "react";
import { useDebouncedGetUsersSearchByUsernameAndHost } from "@/apis/users/useGetUsersSearchByUsernameAndHost";
import { EmptyState } from "@/components/common/EmptyState";
import { useLoginStore } from "@/store/login";
import { Loader } from "../../common/Loader";
import { UserCard } from "./UserCard";

/** ユーザー検索モーダルの汎用コンポーネント */
type UserSearchModalProps = {
  open: boolean;
  onClose: () => void;
  onUserSelect: (user: UserDetailed) => Promise<void> | void;
};

export const UserSearchModal = ({
  open,
  onClose,
  onUserSelect,
}: UserSearchModalProps) => {
  const [username, setUsername] = useState("");
  const [host, setHost] = useState("");

  const handleUserSelect = async (user: UserDetailed) => {
    await onUserSelect(user);
    setUsername("");
    setHost("");
    onClose();
  };

  return (
    <Modal.Root
      onClose={() => {
        onClose();
        setUsername("");
        setHost("");
      }}
      open={open}
      placement="center"
      size="xl"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>ユーザーを検索</Modal.Header>
        <Modal.Body>
          <UserSearchForm setHost={setHost} setUsername={setUsername} />
          <UserSearchResult
            host={host}
            onUserSelect={handleUserSelect}
            username={username}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
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
            <AtIcon />
          </InputGroup.Addon>
          <Input
            autoComplete="none"
            autoFocus
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="username"
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
            placeholder="misskey.example"
          />
        </InputGroup.Root>
      </Field.Root>
    </HStack>
  );
};

type UserSearchResultProps = {
  username: string;
  host: string;
  onUserSelect: (user: UserDetailed) => Promise<void>;
};

const UserSearchResult = ({
  username,
  host,
  onUserSelect,
}: UserSearchResultProps) => {
  const { mySelf } = useLoginStore();
  const { users, isLoading } = useDebouncedGetUsersSearchByUsernameAndHost({
    host,
    username,
  });

  // 自分を検索結果から除外
  const filteredUsers = users?.filter((user) => user.id !== mySelf?.id);

  // ローディング状態
  if ((username || host) && isLoading) {
    return (
      <Center py="6" w="full">
        <Loader />
      </Center>
    );
  }

  // 初期状態: 検索語が未入力の場合
  if ((!username && !host) || !filteredUsers) {
    return <EmptyState icon={<MagnifyingGlassPlusIcon />} />;
  }

  // 検索結果がない場合
  if (filteredUsers.length === 0) {
    return <EmptyState title="ユーザーが見つかりません" />;
  }

  // 検索結果がある場合
  return (
    <VStack gap="2" mt="4" w="full">
      {filteredUsers.map((user) => (
        <UserCard
          clickAction={async () => {
            await onUserSelect(user);
          }}
          key={user.id}
          userId={user.id}
        />
      ))}
    </VStack>
  );
};
