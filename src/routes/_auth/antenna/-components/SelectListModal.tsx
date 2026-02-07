import { ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Input,
  InputGroup,
  Modal,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useMemo, useState } from "react";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { EmptyState } from "@/components/common/EmptyState";
import { Loader } from "@/components/common/Loader";

type SelectListModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (list: { id: string; name: string }) => void;
};

/**
 * リスト選択モーダル
 * 自分のリスト一覧を表示し、検索・選択ができる
 */
const SelectListModal = ({ open, onClose, onSelect }: SelectListModalProps) => {
  const { lists, isLoading } = useGetUserListsList();
  const [searchQuery, setSearchQuery] = useState("");

  /** 検索クエリでフィルタリングされたリスト */
  const filteredLists = useMemo(() => {
    if (!lists || !Array.isArray(lists)) return [];
    if (!searchQuery.trim()) return [...lists];
    const query = searchQuery.trim().toLowerCase();
    return lists.filter((l) => l.name.toLowerCase().includes(query));
  }, [lists, searchQuery]);

  const handleSelect = (list: { id: string; name: string }) => {
    onSelect(list);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal.Root onClose={handleClose} open={open} placement="center" size="lg">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>リストを選択</Modal.Header>
        <Modal.Body>
          <VStack gap="md">
            {/* 検索フォーム */}
            <InputGroup.Root>
              <InputGroup.Addon>
                <MagnifyingGlassIcon />
              </InputGroup.Addon>
              <Input
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="リスト名で検索"
                value={searchQuery}
              />
            </InputGroup.Root>

            {/* リスト一覧 */}
            <ListItems
              filteredLists={filteredLists}
              isLoading={isLoading}
              onSelect={handleSelect}
              searchQuery={searchQuery}
            />
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

type ListItemsProps = {
  isLoading: boolean;
  filteredLists: { id: string; name: string }[];
  searchQuery: string;
  onSelect: (list: { id: string; name: string }) => void;
};

/** リスト一覧の表示 */
const ListItems = ({
  isLoading,
  filteredLists,
  searchQuery,
  onSelect,
}: ListItemsProps) => {
  if (isLoading) {
    return <Loader />;
  }

  if (filteredLists.length === 0 && searchQuery.trim()) {
    return <EmptyState title="リストが見つかりません" />;
  }

  if (filteredLists.length === 0) {
    return <EmptyState title="リストがありません" />;
  }

  return (
    <VStack gap="sm" maxH="60vh" overflowY="auto">
      {filteredLists.map((list) => (
        <Card.Root
          _hover={{ opacity: 0.7, cursor: "pointer" }}
          colorScheme="sky"
          key={list.id}
          onClick={() => onSelect(list)}
          p="md"
          transition="opacity 0.2s"
          variant="subtle"
        >
          <HStack gap="sm">
            <Box flexShrink="0" as={ListIcon} fontSize="1.2rem" />
            <Text>{list.name}</Text>
          </HStack>
        </Card.Root>
      ))}
    </VStack>
  );
};

type SelectListFieldProps = {
  /** 選択中のリストID */
  listId: string;
  /** 選択中のリスト名 */
  listName: string;
  /** リスト選択時のコールバック */
  onSelect: (list: { id: string; name: string }) => void;
  /** リスト選択解除時のコールバック */
  onClear: () => void;
};

/**
 * リスト選択フィールド
 * 選択済みリストの表示、選択ボタン、選択解除ボタンを提供する
 */
export const SelectListField = ({
  listId,
  listName,
  onSelect,
  onClear,
}: SelectListFieldProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {listId ? (
        <VStack gap="sm">
          <Badge
            colorScheme="sky"
            size="lg"
            variant="subtle"
            gap="sm"
            py="xs"
            w="fit-content"
            whiteSpace="pre-wrap"
          >
            <Box flexShrink="0" as={ListIcon} fontSize="1.2rem" />
            {listName}
          </Badge>
          <HStack gap="sm">
            <Button
              colorScheme="sky"
              onClick={() => setIsModalOpen(true)}
              size="sm"
              variant="surface"
            >
              <Text>再選択</Text>
            </Button>
            <Button
              colorScheme="danger"
              onClick={onClear}
              size="sm"
              startIcon={<XIcon weight="bold" />}
              variant="subtle"
            >
              <Text>選択解除</Text>
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Button
          colorScheme="sky"
          onClick={() => setIsModalOpen(true)}
          size="md"
          startIcon={<Box flexShrink="0" as={ListIcon} fontSize="1.2rem" />}
          variant="surface"
        >
          <Text>リストを選択</Text>
        </Button>
      )}
      <SelectListModal
        onClose={() => setIsModalOpen(false)}
        onSelect={onSelect}
        open={isModalOpen}
      />
    </>
  );
};
