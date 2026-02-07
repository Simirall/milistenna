import { PlusIcon } from "@phosphor-icons/react";
import { Button, Text, useDisclosure } from "@yamada-ui/react";
import type { RefObject } from "react";
import { UserSearchModal } from "@/components/domain/user/AddUserModal";

type AddUserToTextButtonProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
};

/**
 * ユーザー検索モーダルを使ってテキストエリアにユーザーを追加するボタン
 * カーソルが行の先頭かつ空行ならそのまま挿入、それ以外は次の行に挿入する
 */
export const AddUserToTextButton = ({
  textareaRef,
  value,
  onChange,
}: AddUserToTextButtonProps) => {
  const { open, onOpen, onClose } = useDisclosure();

  const handleAdd = (text: string) => {
    const el = textareaRef.current;
    if (!el || !value) {
      onChange(value ? `${value}\n${text}` : text);
      return;
    }
    const pos = el.selectionStart ?? value.length;
    // カーソルがある行の先頭位置と末尾位置を取得
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    const lineEnd = value.indexOf("\n", pos);
    const line = value.slice(
      lineStart,
      lineEnd === -1 ? value.length : lineEnd,
    );
    const isAtLineStart = pos === lineStart;
    const isLineEmpty = line.length === 0;

    let newValue: string;
    let newCursorPos: number;
    if (isAtLineStart && isLineEmpty) {
      // 行の先頭かつ空行: そのまま挿入
      newValue = `${value.slice(0, pos)}${text}${value.slice(pos)}`;
      newCursorPos = pos + text.length;
    } else {
      // それ以外: 次の行に挿入
      const insertPos = lineEnd === -1 ? value.length : lineEnd;
      newValue = `${value.slice(0, insertPos)}\n${text}${value.slice(insertPos)}`;
      newCursorPos = insertPos + 1 + text.length;
    }
    onChange(newValue);
    // カーソル位置を挿入後の位置に設定
    requestAnimationFrame(() => {
      el.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  return (
    <>
      <Button
        colorScheme="cyan"
        onClick={onOpen}
        size="sm"
        startIcon={<PlusIcon weight="bold" />}
        variant="surface"
      >
        <Text>ユーザーを検索して追加</Text>
      </Button>
      <UserSearchModal
        onClose={onClose}
        onUserSelect={(user) => {
          const handle = `@${user.username}${user.host ? `@${user.host}` : ""}`;
          handleAdd(handle);
        }}
        open={open}
      />
    </>
  );
};
