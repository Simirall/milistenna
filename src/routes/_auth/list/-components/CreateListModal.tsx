import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { Plus } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  VStack,
  useDisclosure,
} from "@yamada-ui/react";
import type { UsersListsCreateRequest } from "misskey-js/entities.js";
import { z } from "zod";

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
    validators: {
      onChange: createListSchema,
    },
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
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        form.reset();
        onClose();
      }}
    >
      <ModalHeader>リストを作成</ModalHeader>
      <ModalBody>
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
              <FormControl
                invalid={field.state.meta.errors.length > 0}
                errorMessage={field.state.meta.errors[0]?.message}
              >
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            )}
          </form.Field>
          <HStack justify="end">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  size="lg"
                  type="submit"
                  disabled={!canSubmit}
                  loading={isSubmitting}
                  colorScheme="sky"
                >
                  <Text>作成</Text>
                </Button>
              )}
            </form.Subscribe>
            <Button
              size="lg"
              colorScheme="cyan"
              variant="subtle"
              onClick={() => {
                onClose();
                form.reset();
              }}
            >
              <Text>キャンセル</Text>
            </Button>
          </HStack>
        </VStack>
      </ModalBody>
    </Modal>
  );
};

export const CreateListModalButton = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        pos="fixed"
        bottom="md"
        right="md"
        borderRadius="full"
        size="xl"
        colorScheme="sky"
        onClick={onOpen}
      >
        <Plus weight="bold" fontSize="1.6rem" />
      </IconButton>
      <CreateListModal open={open} onClose={onClose} />
    </>
  );
};
