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
    <Modal.Root onClose={onClose} open={open}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body py="sm">{children}</Modal.Body>
        <Modal.Footer>
          <Button
            colorScheme={colorScheme}
            loading={isSubmitting}
            onClick={async () => {
              setSubmitting(true);
              await onAccept();
              setSubmitting(false);
              onClose();
            }}
            size="lg"
            variant="solid"
          >
            <Text>{okText}</Text>
          </Button>
          <Button
            colorScheme={colorScheme}
            loading={isSubmitting}
            onClick={onClose}
            size="lg"
            variant="subtle"
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
          colorScheme={props.colorScheme ?? "teal"}
          onClick={onOpen}
          size="lg"
          variant="surface"
          {...(props.buttonProps as ButtonProps)}
        >
          <Text>{props.button}</Text>
        </Button>
      ) : (
        <IconButton
          colorScheme={props.colorScheme ?? "teal"}
          onClick={onOpen}
          size="lg"
          variant="surface"
          {...(props.buttonProps as IconButtonProps)}
        >
          {props.button}
        </IconButton>
      )}
      <Confirm onClose={onClose} open={open} {...props} />
    </>
  );
};
