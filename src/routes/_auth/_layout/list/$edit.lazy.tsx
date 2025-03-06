import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { AddUserModalButton } from "@/components/AddUserModal";
import { Loader } from "@/components/Loader";
import { UserCardContainer } from "@/components/UserCardContainer";
import { useLoginStore } from "@/store/login";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { isError } from "@/utils/isError";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionItem,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  Switch,
  Text,
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
  const { mySelf } = useLoginStore();
  const { list } = useGetUsersListsShow(edit);

  if (!list || isError(list)) {
    return <Loader />;
  }

  return (
    <VStack p="4">
      <Heading size="lg">{list.name}</Heading>
      <ListForm list={list} listId={edit} />
      <AddUserModalButton />
      <Text>
        メンバー(
        {`${list.userIds?.length ?? 0}/${mySelf?.policies.userEachUserListsLimit}`}
        )
      </Text>
      {list.userIds && <UserCardContainer userIds={list.userIds} />}
    </VStack>
  );
}

const ListForm: FC<{ list: UserList; listId: string }> = ({ list, listId }) => {
  const { refetch } = useGetUsersListsShow(listId);

  const form = useForm({
    defaultValues: {
      listId: listId,
      name: list.name,
      isPublic: list.isPublic,
    } satisfies z.infer<typeof editListSchema>,
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
                required
                invalid={field.state.meta.errors.length > 0}
                errorMessage={field.state.meta.errors.join(", ")}
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
                checked={field.state.value}
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
              loading={form.state.isSubmitting}
            >
              変更
            </Button>
            <DeleteListButton listId={list.id} name={list.name} />
          </HStack>
        </VStack>
      </AccordionItem>
    </Accordion>
  );
};
