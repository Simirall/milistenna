import { useNavigate } from "@tanstack/react-router";
import {
  Button,
  Field,
  Input,
  Modal,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import type { Antenna, AntennasCreateRequest } from "misskey-js/entities.js";
import { useState } from "react";
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { LimitAlert } from "@/components/common/LimitAlert";
import { useLoginStore } from "@/store/login";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";

type CopyAntennaModalProps = {
  antenna: Antenna;
};

/** アンテナをコピーして新規作成するモーダル */
export const CopyAntennaButton = ({ antenna }: CopyAntennaModalProps) => {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: limitOpen,
    onOpen: onLimitOpen,
    onClose: onLimitClose,
  } = useDisclosure();
  const { mySelf } = useLoginStore();
  const { antennas, refetch } = useGetAntennasList();
  const navigate = useNavigate();
  const [name, setName] = useState(`${antenna.name} のコピー`);
  const [isSubmitting, setSubmitting] = useState(false);

  const antennaLimit = mySelf?.policies.antennaLimit ?? 0;
  const isLimitReached = (antennas?.length ?? 0) >= antennaLimit;

  const handleClick = () => {
    if (isLimitReached) {
      onLimitOpen();
      return;
    }
    setName(`${antenna.name} のコピー`);
    onOpen();
  };

  const handleCopy = async () => {
    setSubmitting(true);
    try {
      const payload: AntennasCreateRequest = {
        name,
        src: antenna.src,
        userListId: antenna.userListId,
        users: antenna.users ?? [],
        keywords: antenna.keywords,
        excludeKeywords: antenna.excludeKeywords,
        caseSensitive: antenna.caseSensitive,
        localOnly: antenna.localOnly,
        excludeBots: antenna.excludeBots,
        withReplies: antenna.withReplies,
        withFile: antenna.withFile,
        excludeNotesInSensitiveChannel: antenna.excludeNotesInSensitiveChannel,
      };
      await fetch(
        getApiUrl("antennas/create"),
        getFetchObject<AntennasCreateRequest>(payload),
      );
      await refetch();
      onClose();
      navigate({ to: "/antenna" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        colorScheme="blue"
        onClick={handleClick}
        size="lg"
        variant="surface"
      >
        <Text>コピー</Text>
      </Button>

      {/* コピー名入力モーダル */}
      <Modal.Root onClose={onClose} open={open}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>アンテナをコピー</Modal.Header>
          <Modal.Body py="sm">
            <Field.Root label="アンテナ名" required>
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="アンテナ名"
                value={name}
              />
            </Field.Root>
          </Modal.Body>
          <Modal.Footer>
            <Button
              colorScheme="emerald"
              disabled={!name.trim()}
              loading={isSubmitting}
              onClick={handleCopy}
              size="lg"
              variant="solid"
            >
              <Text>コピーして作成</Text>
            </Button>
            <Button
              colorScheme="emerald"
              loading={isSubmitting}
              onClick={onClose}
              size="lg"
              variant="subtle"
            >
              <Text>キャンセル</Text>
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      {/* 上限到達アラート */}
      <LimitAlert onClose={onLimitClose} open={limitOpen}>
        <Text>
          アンテナの作成上限（{antennaLimit}件）に達しています。
          新しいアンテナを作成するには、既存のアンテナを削除してください。
        </Text>
      </LimitAlert>
    </>
  );
};
