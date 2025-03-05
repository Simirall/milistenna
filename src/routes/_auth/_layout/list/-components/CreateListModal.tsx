import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { Plus } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  VStack,
  useDisclosure,
} from "@yamada-ui/react";
import type { UsersListsCreateRequest } from "misskey-js/entities.js";
import type { FC } from "react";
import { z } from "zod";

const createListSchema = z.object({
  name: z
    .string()
    .min(1, "リスト名を入力してください")
    .max(100, "最大100文字までです"),
});

const CreateListModal: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { refetch } = useGetUserListsList();

  const form = useForm({
    defaultValues: {
      name: "",
    } satisfies z.infer<typeof createListSchema>,
    validatorAdapter: zodValidator(),
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
                errorMessage={field.state.meta.errors}
              >
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormControl>
            )}
          </form.Field>
          <HStack>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  loading={isSubmitting}
                  colorScheme="sky"
                  flex={1}
                >
                  作成
                </Button>
              )}
            </form.Subscribe>
            <Button
              colorScheme="cyan"
              variant="subtle"
              flex={1}
              onClick={() => {
                onClose();
                form.reset();
              }}
            >
              キャンセル
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
