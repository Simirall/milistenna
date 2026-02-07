import { CaretLeftIcon, PlusIcon } from "@phosphor-icons/react";
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
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import type { UserList, UsersListsUpdateRequest } from "misskey-js/entities.js";
import { useState } from "react";
import { z } from "zod";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { LimitAlert } from "@/components/common/LimitAlert";
import { Loader } from "@/components/common/Loader";
import { AddUserModalButton } from "./-components/AddUserModal";
import { UserCard } from "@/components/domain/user/UserCard";
import { useLoginStore } from "@/store/login";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { isError } from "@/utils/isError";
import { DeleteListButton } from "./-components/DeleteListModal";
import { DeleteUserButton } from "./-components/DeleteUserModal";
import { useGetUserListsList } from "@/apis/lists/useGetUsersListsList";

export const Route = createLazyFileRoute("/_auth/list/$edit")({
  component: RouteComponent,
});

const editListSchema = z.object({
  isPublic: z.boolean(),
  listId: z.string(),
  name: z
    .string()
    .min(1, "リスト名を入力してください")
    .max(100, "最大100文字までです"),
});

function RouteComponent() {
  const { edit } = Route.useParams();
  const { mySelf } = useLoginStore();
  const { list } = useGetUsersListsShow(edit);
  const { open, onOpen, onClose } = useDisclosure();

  if (!list || isError(list)) {
    return <Loader />;
  }

  const userEachUserListsLimit =
    mySelf?.policies.userEachUserListsLimit ?? 0;
  const isLimitReached =
    (list.userIds?.length ?? 0) >= userEachUserListsLimit;

  return (
    <>
      <title>リスト編集 | Milistenna</title>
      <VStack>
        <Heading size="lg">{list.name}</Heading>
        <ListForm list={list} listId={edit} />
        {isLimitReached ? (
          <>
            <Button
              colorScheme="sky"
              onClick={onOpen}
              size="lg"
              startIcon={<PlusIcon weight="bold" />}
              variant="surface"
            >
              <Text>ユーザーを追加</Text>
            </Button>
            <LimitAlert onClose={onClose} open={open}>
              <Text>
                このリストのユーザー数上限（{userEachUserListsLimit}
                人）に達しています。
                新しいユーザーを追加するには、既存のユーザーを削除してください。
              </Text>
            </LimitAlert>
          </>
        ) : (
          <AddUserModalButton />
        )}
        <Text>
          メンバー(
          {`${list.userIds?.length ?? 0}/${mySelf?.policies.userEachUserListsLimit}`}
          )
        </Text>
        {list.userIds && (
          <VStack>
            {list.userIds.map((u) => (
              <UserCard
                endComponent={<DeleteUserButton listId={list.id} userId={u} />}
                key={u}
                userId={u}
              />
            ))}
          </VStack>
        )}
      </VStack>
      <FloatLinkButton
        colorScheme="sky"
        linkProps={{
          to: "/list",
        }}
        position="left"
      >
        <CaretLeftIcon fontSize="1em" weight="bold" />
      </FloatLinkButton>
    </>
  );
}

type ListFormProps = { list: UserList; listId: string };

const ListForm = ({ list, listId }: ListFormProps) => {
  const { refetch } = useGetUsersListsShow(listId);
  const { refetch: refetchList } = useGetUserListsList();
  const [accordionIndex, onChangeAccordionIndex] =
    useState<UseAccordionProps["index"]>(-1);

  const form = useForm({
    defaultValues: {
      isPublic: list.isPublic,
      listId: listId,
      name: list.name,
    } satisfies z.infer<typeof editListSchema>,
    onSubmit: async ({ value }) => {
      await fetch(
        getApiUrl("users/lists/update"),
        getFetchObject<UsersListsUpdateRequest>(value),
      );
      onChangeAccordionIndex(-1);
      await Promise.all([refetch(), refetchList()]);
    },
    validators: {
      onChange: editListSchema,
    },
  });

  return (
    <Accordion.Root
      index={accordionIndex}
      onChange={onChangeAccordionIndex}
      toggle
      variant="panel"
    >
      <Accordion.Item index={0}>
        <Accordion.Button>設定</Accordion.Button>
        <Accordion.Panel>
          <VStack
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            p="2"
          >
            <form.Field name="name">
              {(field) => (
                <Field.Root
                  errorMessage={field.state.meta.errors[0]?.message}
                  invalid={field.state.meta.errors.length > 0}
                  label="リスト名"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                  />
                </Field.Root>
              )}
            </form.Field>
            <form.Field name="isPublic">
              {(field) => (
                <Switch
                  checked={field.state.value}
                  colorScheme="sky"
                  onChange={(e) => field.handleChange(e.target.checked)}
                  size="lg"
                >
                  <Text>パブリック</Text>
                </Switch>
              )}
            </form.Field>
            <HStack>
              <Button
                colorScheme="sky"
                loading={form.state.isSubmitting}
                size="lg"
                type="submit"
                variant="surface"
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
