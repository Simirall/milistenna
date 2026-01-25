import { CaretLeftIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Switch,
  Text,
  type UseAccordionProps,
  VStack,
} from "@yamada-ui/react";
import type { UserList, UsersListsUpdateRequest } from "misskey-js/entities.js";
import { useState } from "react";
import { z } from "zod";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { Loader } from "@/components/common/Loader";
import { AddUserModalButton } from "@/components/feature/user/AddUserModal";
import { UserCard } from "@/components/feature/user/UserCard";
import { useLoginStore } from "@/store/login";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { isError } from "@/utils/isError";
import { DeleteListButton } from "./-components/DeleteListModal";
import { DeleteUserButton } from "./-components/DeleteUserModal";

export const Route = createLazyFileRoute("/_auth/list/$edit")({
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
    <>
      <VStack>
        <Heading size="lg">{list.name}</Heading>
        <ListForm list={list} listId={edit} />
        <AddUserModalButton />
        <Text>
          メンバー(
          {`${list.userIds?.length ?? 0}/${mySelf?.policies.userEachUserListsLimit}`}
          )
        </Text>
        {list.userIds && (
          <VStack>
            {list.userIds.map((u) => (
              <UserCard
                key={u}
                userId={u}
                endComponent={<DeleteUserButton listId={list.id} userId={u} />}
              />
            ))}
          </VStack>
        )}
      </VStack>
      <FloatLinkButton
        colorScheme="sky"
        position="left"
        linkProps={{
          to: "/list",
        }}
      >
        <CaretLeftIcon weight="bold" fontSize="1em" />
      </FloatLinkButton>
    </>
  );
}

type ListFormProps = { list: UserList; listId: string };

const ListForm = ({ list, listId }: ListFormProps) => {
  const { refetch } = useGetUsersListsShow(listId);
  const [accordionIndex, onChangeAccordionIndex] =
    useState<UseAccordionProps["index"]>(-1);

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
      onChangeAccordionIndex(-1);
      refetch();
    },
  });

  return (
    <Accordion.Root
      variant="panel"
      toggle
      index={accordionIndex}
      onChange={onChangeAccordionIndex}
    >
      <Accordion.Item index={0}>
        <Accordion.Button>設定</Accordion.Button>
        <Accordion.Panel>
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
                <Field.Root
                  label="リスト名"
                  required
                  invalid={field.state.meta.errors.length > 0}
                  errorMessage={field.state.meta.errors[0]?.message}
                >
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field.Root>
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
                  <Text>パブリック</Text>
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
                <Text>変更</Text>
              </Button>
              <DeleteListButton listId={list.id} name={list.name} />
            </HStack>
          </VStack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
};
