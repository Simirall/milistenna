import { PlusIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import {
  Button,
  Field,
  IconButton,
  Input,
  Modal,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import { useState } from "react";
import { z } from "zod";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { ApiErrorMessage } from "@/components/common/ApiErrorMessage";
import { LimitAlert } from "@/components/common/LimitAlert";
import { useLoginStore } from "@/store/login";
import { getUserErrorMessage, reportInternalError } from "@/utils/appError";
import { writeApi } from "@/utils/writeApi";

const createListSchema = z.object({
  name: z
    .string()
    .min(1, "リスト名を入力してください")
    .max(100, "最大100文字までです"),
});

type CreateListModalProps = { open: boolean; onClose: () => void };

const CreateListModal = ({ open, onClose }: CreateListModalProps) => {
  const { refetch } = useGetUserListsList();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      name: "",
    } satisfies z.infer<typeof createListSchema>,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);
      try {
        await writeApi("users/lists/create", {
          name: value.name,
        });
        await refetch();
        onClose();
        form.reset();
      } catch (error) {
        reportInternalError("list-create", error);
        setSubmitError(getUserErrorMessage(error));
      }
    },
    validators: {
      onChange: createListSchema,
    },
  });

  return (
    <Modal.Root
      onClose={() => {
        setSubmitError(undefined);
        form.reset();
        onClose();
      }}
      open={open}
    >
      <Modal.Overlay />
      <Modal.Content
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Modal.Header>リストを作成</Modal.Header>
        <Modal.Body>
          <form.Field name="name">
            {(field) => (
              <Field.Root
                errorMessage={field.state.meta.errors[0]?.message}
                invalid={field.state.meta.errors.length > 0}
              >
                <Input
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  autoFocus
                  placeholder="リスト名"
                />
              </Field.Root>
            )}
          </form.Field>
          <ApiErrorMessage message={submitError} />
        </Modal.Body>
        <Modal.Footer>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                colorScheme="sky"
                disabled={!canSubmit}
                loading={isSubmitting}
                size="lg"
                type="submit"
              >
                <Text>作成</Text>
              </Button>
            )}
          </form.Subscribe>
          <Button
            colorScheme="sky"
            onClick={() => {
              setSubmitError(undefined);
              onClose();
              form.reset();
            }}
            size="lg"
            variant="subtle"
          >
            <Text>キャンセル</Text>
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export const CreateListModalButton = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: limitOpen,
    onOpen: onLimitOpen,
    onClose: onLimitClose,
  } = useDisclosure();
  const { mySelf } = useLoginStore();
  const { lists } = useGetUserListsList();

  const userListLimit = mySelf?.policies.userListLimit ?? 0;
  const isLimitReached = (lists?.length ?? 0) >= userListLimit;

  return (
    <>
      <IconButton
        borderRadius="full"
        bottom="xl"
        colorScheme="sky"
        onClick={isLimitReached ? onLimitOpen : onOpen}
        pos="fixed"
        right={{ base: "calc(20vw + 1rem)", md: "xl" }}
        shadow="md"
        size="xl"
      >
        <PlusIcon fontSize="1.6rem" weight="bold" />
      </IconButton>
      <CreateListModal onClose={onClose} open={open} />
      <LimitAlert onClose={onLimitClose} open={limitOpen}>
        <Text>
          リストの作成上限（{userListLimit}件）に達しています。
          新しいリストを作成するには、既存のリストを削除してください。
        </Text>
      </LimitAlert>
    </>
  );
};
