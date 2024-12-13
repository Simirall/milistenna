import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { Loader } from "@/components/Loader";
import { UserCardContainer } from "@/components/UserCardContainer";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { isError } from "@/utils/isError";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  Accordion,
  AccordionItem,
  Button,
  FormControl,
  HStack,
  Input,
  Switch,
  VStack,
} from "@yamada-ui/react";
import type { UserList, UsersListsUpdateRequest } from "misskey-js/entities.js";
import type { FC } from "react";
import { z } from "zod";
import { DeleteListButton } from "./-components/DeleteListModal";

export const Route = createLazyFileRoute("/_auth/_layout/list/$edit")({
  component: RouteComponent,
});

const editListSchema = z.object({
  listId: z.string(),
  name: z
    .string()
    .min(1, "リスト名を入力してください")
    .max(100, "最大100文字までです"),
  isPublic: z.boolean(),
});

function RouteComponent() {
  const { edit } = Route.useParams();
  const { data } = useGetUsersListsShow(edit)();

  if (!data || isError(data)) {
    return <Loader />;
  }

  return (
    <VStack p="4">
      <ListForm data={data} listId={edit} />
      {data.userIds && <UserCardContainer userIds={data.userIds} />}
    </VStack>
  );
}

const ListForm: FC<{ data: UserList; listId: string }> = ({ data, listId }) => {
  const { refetch } = useGetUsersListsShow(listId)();

  const form = useForm({
    defaultValues: {
      listId: listId,
      name: data.name,
      isPublic: data.isPublic,
    } satisfies z.infer<typeof editListSchema>,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: editListSchema,
    },
    onSubmit: async ({ value }) => {
      await fetch(
        getApiUrl("users/lists/update"),
        getFetchObject<UsersListsUpdateRequest>(value),
      );
      refetch();
    },
  });

  return (
    <Accordion variant="card" isToggle>
      <AccordionItem label="設定">
        <VStack
          p="2"
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
                label="リスト名"
                isRequired
                isInvalid={field.state.meta.errors.length > 0}
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
          <form.Field name="isPublic">
            {(field) => (
              <Switch
                size="lg"
                colorScheme="teal"
                isChecked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              >
                パブリック
              </Switch>
            )}
          </form.Field>
          <HStack>
            <Button
              type="submit"
              colorScheme="cyan"
              variant="surface"
              size="lg"
              isLoading={form.state.isSubmitting}
            >
              変更
            </Button>
            <DeleteListButton listId={data.id} name={data.name} />
          </HStack>
        </VStack>
      </AccordionItem>
    </Accordion>
  );
};
