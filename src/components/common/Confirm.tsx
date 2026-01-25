import {
  Button,
  type ButtonProps,
  type ColorScheme,
  IconButton,
  type IconButtonProps,
  Modal,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import { type ReactElement, type ReactNode, useState } from "react";

type ConfirmProps = {
  children: ReactNode;
  title?: string;
  okText?: string;
  cancelText?: string;
  colorScheme?: ColorScheme;
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
    <Modal.Root open={open} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body py="sm">{children}</Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
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
          colorScheme={props.colorScheme ?? "teal"}
          onClick={onOpen}
          {...(props.buttonProps as ButtonProps)}
        >
          <Text>{props.button}</Text>
        </Button>
      ) : (
        <IconButton
          size="lg"
          variant="surface"
          colorScheme={props.colorScheme ?? "teal"}
          onClick={onOpen}
          {...(props.buttonProps as IconButtonProps)}
        >
          {props.button}
        </IconButton>
      )}
      <Confirm open={open} onClose={onClose} {...props} />
    </>
  );
};
