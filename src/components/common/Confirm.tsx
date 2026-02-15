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
import { getUserErrorMessage, reportInternalError } from "@/utils/appError";
import { ApiErrorMessage } from "./ApiErrorMessage";

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
  const [submitError, setSubmitError] = useState<string | undefined>();

  return (
    <Modal.Root onClose={onClose} open={open}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body py="sm" whiteSpace="pre-wrap" wordBreak="break-word">
          {children}
          <ApiErrorMessage message={submitError} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            colorScheme={colorScheme}
            loading={isSubmitting}
            onClick={async () => {
              setSubmitError(undefined);
              setSubmitting(true);
              try {
                await onAccept();
                onClose();
              } catch (error) {
                reportInternalError("confirm-modal", error);
                setSubmitError(getUserErrorMessage(error));
              } finally {
                setSubmitting(false);
              }
            }}
            size="lg"
            variant="solid"
          >
            <Text>{okText}</Text>
          </Button>
          <Button
            colorScheme={colorScheme}
            loading={isSubmitting}
            onClick={() => {
              setSubmitError(undefined);
              onClose();
            }}
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
