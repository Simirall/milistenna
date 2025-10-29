import {
  Button,
  type ButtonProps,
  IconButton,
  type IconButtonProps,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  type ThemeColorScheme,
  useDisclosure,
} from "@yamada-ui/react";
import { type ReactElement, type ReactNode, useState } from "react";

type ConfirmProps = {
  children: ReactNode;
  title?: string;
  okText?: string;
  cancelText?: string;
  colorScheme?: ThemeColorScheme;
  onAccept: (() => Promise<void>) | (() => void);
};

type ConfirmModalInternalProps = {
  open: boolean;
  onClose: () => void;
} & ConfirmProps;

const Confirm = ({
  open,
  onClose,
  children,
  title = "",
  okText = "OK",
  cancelText = "キャンセル",
  colorScheme = "teal",
  onAccept,
}: ConfirmModalInternalProps) => {
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody py="sm">{children}</ModalBody>
      <ModalFooter>
        <Button
          size="lg"
          variant="solid"
          colorScheme={colorScheme}
          loading={isSubmitting}
          onClick={async () => {
            setSubmitting(true);
            await onAccept();
            setSubmitting(false);
            onClose();
          }}
        >
          <Text>{okText}</Text>
        </Button>
        <Button
          size="lg"
          variant="subtle"
          colorScheme={colorScheme}
          loading={isSubmitting}
          onClick={onClose}
        >
          <Text>{cancelText}</Text>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

type ConfirmModalProps = ConfirmProps &
  (
    | {
        button: string;
        buttonProps?: ButtonProps;
      }
    | {
        button: ReactElement;
        buttonProps?: IconButtonProps;
      }
  );

export const ConfirmModal = (props: ConfirmModalProps) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      {typeof props.button === "string" ? (
        <Button
          size="lg"
          variant="surface"
          colorScheme={props.colorScheme}
          onClick={onOpen}
          {...props.buttonProps}
        >
          <Text>{props.button}</Text>
        </Button>
      ) : (
        <IconButton
          size="lg"
          variant="surface"
          colorScheme={props.colorScheme}
          onClick={onOpen}
          icon={props.button}
          {...props.buttonProps}
        />
      )}
      <Confirm open={open} onClose={onClose} {...props} />
    </>
  );
};
