import { PlusIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import {
  Button,
  Field,
  HStack,
  IconButton,
  Input,
  Modal,
  Text,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import type { UsersListsCreateRequest } from "misskey-js/entities.js";
import { z } from "zod";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";

const createListSchema = z.object({
  name: z
    .string()
    .min(1, "リスト名を入力してください")
    .max(100, "最大100文字までです"),
});

type CreateListModalProps = { open: boolean; onClose: () => void };

const CreateListModal = ({ open, onClose }: CreateListModalProps) => {
  const { refetch } = useGetUserListsList();

  const form = useForm({
    defaultValues: {
      name: "",
    } satisfies z.infer<typeof createListSchema>,
    onSubmit: async ({ value }) => {
      await fetch(
        getApiUrl("users/lists/create"),
        getFetchObject<UsersListsCreateRequest>({
          name: value.name,
        }),
      );
      await refetch();
      onClose();
      form.reset();
    },
    validators: {
      onChange: createListSchema,
    },
  });

  return (
    <Modal.Root
      onClose={() => {
        form.reset();
        onClose();
      }}
      open={open}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>リストを作成</Modal.Header>
        <Modal.Body>
          <VStack
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
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
                  />
                </Field.Root>
              )}
            </form.Field>
            <HStack justify="end">
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
                colorScheme="cyan"
                onClick={() => {
                  onClose();
                  form.reset();
                }}
                size="lg"
                variant="subtle"
              >
                <Text>キャンセル</Text>
              </Button>
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export const CreateListModalButton = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        borderRadius="full"
        bottom="xl"
        colorScheme="sky"
        onClick={onOpen}
        pos="fixed"
        right={{ base: "calc(20vw + 1rem)", md: "xl" }}
        shadow="md"
        size="xl"
      >
        <PlusIcon fontSize="1.6rem" weight="bold" />
      </IconButton>
      <CreateListModal onClose={onClose} open={open} />
    </>
  );
};
