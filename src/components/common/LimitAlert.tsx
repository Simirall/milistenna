import { Button, Modal, Text } from "@yamada-ui/react";
import type { ReactNode } from "react";

type LimitAlertProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/** ポリシー上限超過時に表示するアラートモーダル */
export const LimitAlert = ({
  open,
  onClose,
  title = "上限に達しています",
  children,
}: LimitAlertProps) => {
  return (
    <Modal.Root onClose={onClose} open={open}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body py="sm">{children}</Modal.Body>
        <Modal.Footer>
          <Button colorScheme="gray" onClick={onClose} size="lg">
            <Text>OK</Text>
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
