import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import {
  Button,
  Field,
  HStack,
  Input,
  NativeSelect,
  Separator,
  Switch,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import type {
  Antenna,
  AntennasCreateRequest,
  AntennasUpdateRequest,
} from "misskey-js/entities.js";
import { useRef } from "react";
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { useGetAntennasShow } from "@/apis/antennas/useGetAntennasShow";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { keywordsToString, stringToKeywords } from "@/utils/keywords";
import { AddUserToTextButton } from "./AddUserToTextButton";
import { DeleteAntennaButton } from "./DeleteAntennaModal";
import { SelectListField } from "./SelectListModal";

/** 受信ソースの選択肢 */
const srcOptions: { label: string; value: Antenna["src"] }[] = [
  { label: "すべてのノート", value: "all" },
  { label: "指定したユーザー", value: "users" },
  { label: "指定したユーザーを除外", value: "users_blacklist" },
  { label: "リスト", value: "list" },
];

type AntennaFormProps = {
  antenna?: Antenna;
  initialListName: string;
};

export const AntennaForm = ({ antenna, initialListName }: AntennaFormProps) => {
  const isCreate = !antenna;
  const navigate = useNavigate();
  const { refetch } = useGetAntennasList();
  const { refetch: refetchShow } = useGetAntennasShow(antenna?.id ?? "");
  const usersTextareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm({
    defaultValues: {
      name: antenna?.name ?? "",
      src: antenna?.src ?? "all",
      userListId: antenna?.userListId ?? "",
      userListName: initialListName,
      users: antenna?.users?.join("\n") ?? "",
      keywords: antenna ? keywordsToString(antenna.keywords) : "",
      excludeKeywords: antenna ? keywordsToString(antenna.excludeKeywords) : "",
      caseSensitive: antenna?.caseSensitive ?? false,
      localOnly: antenna?.localOnly ?? false,
      excludeBots: antenna?.excludeBots ?? false,
      withReplies: antenna?.withReplies ?? false,
      withFile: antenna?.withFile ?? false,
      excludeNotesInSensitiveChannel:
        antenna?.excludeNotesInSensitiveChannel ?? false,
    },
    onSubmit: async ({ value }) => {
      if (isCreate) {
        const payload: AntennasCreateRequest = {
          ...value,
          userListId: value.src === "list" ? value.userListId : null,
          users:
            value.src === "users" || value.src === "users_blacklist"
              ? value.users.split("\n").filter(Boolean)
              : [],
          keywords: stringToKeywords(value.keywords),
          excludeKeywords: stringToKeywords(value.excludeKeywords),
        };
        await fetch(
          getApiUrl("antennas/create"),
          getFetchObject<AntennasCreateRequest>(payload),
        );
      } else {
        const payload: AntennasUpdateRequest = {
          ...value,
          antennaId: antenna.id,
          userListId: value.src === "list" ? value.userListId : null,
          users:
            value.src === "users" || value.src === "users_blacklist"
              ? value.users.split("\n").filter(Boolean)
              : [],
          keywords: stringToKeywords(value.keywords),
          excludeKeywords: stringToKeywords(value.excludeKeywords),
        };
        await fetch(
          getApiUrl("antennas/update"),
          getFetchObject<AntennasUpdateRequest>(payload),
        );
      }
      await Promise.all([refetch(), refetchShow()]);
      navigate({ to: "/antenna" });
    },
  });

  return (
    <VStack
      as="form"
      gap="lg"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* 名前 */}
      <form.Field name="name">
        {(field) => (
          <Field.Root label="名前" required>
            <Input
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="アンテナ名"
              value={field.state.value}
            />
          </Field.Root>
        )}
      </form.Field>

      {/* 受信ソース */}
      <form.Field name="src">
        {(field) => (
          <Field.Root label="受信ソース">
            <NativeSelect.Root
              onChange={(e) =>
                field.handleChange(e.target.value as Antenna["src"])
              }
              value={field.state.value}
            >
              {srcOptions.map((opt) => (
                <NativeSelect.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </NativeSelect.Option>
              ))}
            </NativeSelect.Root>
          </Field.Root>
        )}
      </form.Field>

      {/* ソースがusersまたはusers_blacklistの場合: ユーザー入力欄 */}
      <form.Subscribe selector={(state) => state.values.src}>
        {(src) =>
          (src === "users" || src === "users_blacklist") && (
            <form.Field name="users">
              {(field) => (
                <Field.Root
                  helperMessage="1行に1ユーザーずつ入力してください（例: @user@example.com）"
                  label="ユーザー"
                  required
                >
                  <Textarea
                    autosize
                    minRows={3}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={"@user@example.com"}
                    ref={usersTextareaRef}
                    required
                    value={field.state.value}
                  />
                  <AddUserToTextButton
                    onChange={(v) => field.handleChange(v)}
                    textareaRef={usersTextareaRef}
                    value={field.state.value}
                  />
                </Field.Root>
              )}
            </form.Field>
          )
        }
      </form.Subscribe>

      {/* ソースがlistの場合: リスト選択 */}
      <form.Subscribe selector={(state) => state.values.src}>
        {(src) =>
          src === "list" && (
            <form.Field
              name="userListId"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? "リストを選択してください" : undefined,
              }}
            >
              {(listIdField) => (
                <form.Field name="userListName">
                  {(listNameField) => (
                    <Field.Root
                      errorMessage={listIdField.state.meta.errors[0]}
                      helperMessage="リストを削除すると、そのリストをソースにしているアンテナも削除されます"
                      invalid={listIdField.state.meta.errors.length > 0}
                      label="リスト"
                      required
                    >
                      <SelectListField
                        listId={listIdField.state.value}
                        listName={listNameField.state.value}
                        onClear={() => {
                          listIdField.handleChange("");
                          listNameField.handleChange("");
                        }}
                        onSelect={(list) => {
                          listIdField.handleChange(list.id);
                          listNameField.handleChange(list.name);
                        }}
                      />
                    </Field.Root>
                  )}
                </form.Field>
              )}
            </form.Field>
          )
        }
      </form.Subscribe>

      <Separator />

      {/* キーワード */}
      <form.Field name="keywords">
        {(field) => (
          <Field.Root
            helperMessage="スペース区切りでAND指定、改行区切りでOR指定"
            label="キーワード"
            required
          >
            <Textarea
              autosize
              minRows={3}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={"とりにく ぎゅうにく\nさかな"}
              value={field.state.value}
              required
            />
          </Field.Root>
        )}
      </form.Field>

      {/* 除外キーワード */}
      <form.Field name="excludeKeywords">
        {(field) => (
          <Field.Root
            helperMessage="スペース区切りでAND指定、改行区切りでOR指定"
            label="除外キーワード"
          >
            <Textarea
              autosize
              minRows={2}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="除外したいキーワード"
              value={field.state.value}
            />
          </Field.Root>
        )}
      </form.Field>

      <Separator />

      {/* トグル設定 */}
      <VStack gap="md">
        <form.Field name="localOnly">
          {(field) => (
            <Switch
              checked={field.state.value}
              colorScheme="emerald"
              onChange={(e) => field.handleChange(e.target.checked)}
              size="lg"
            >
              <Text>ローカルのみ</Text>
            </Switch>
          )}
        </form.Field>

        <form.Field name="caseSensitive">
          {(field) => (
            <Switch
              checked={field.state.value}
              colorScheme="emerald"
              onChange={(e) => field.handleChange(e.target.checked)}
              size="lg"
            >
              <Text>大文字小文字を区別</Text>
            </Switch>
          )}
        </form.Field>

        <form.Field name="excludeBots">
          {(field) => (
            <Switch
              checked={field.state.value}
              colorScheme="emerald"
              onChange={(e) => field.handleChange(e.target.checked)}
              size="lg"
            >
              <Text>Botを除外</Text>
            </Switch>
          )}
        </form.Field>

        <form.Field name="withReplies">
          {(field) => (
            <Switch
              checked={field.state.value}
              colorScheme="emerald"
              onChange={(e) => field.handleChange(e.target.checked)}
              size="lg"
            >
              <Text>リプライを含む</Text>
            </Switch>
          )}
        </form.Field>

        <form.Field name="withFile">
          {(field) => (
            <Switch
              checked={field.state.value}
              colorScheme="emerald"
              onChange={(e) => field.handleChange(e.target.checked)}
              size="lg"
            >
              <Text>ファイル付きのみ</Text>
            </Switch>
          )}
        </form.Field>

        <form.Field name="excludeNotesInSensitiveChannel">
          {(field) => (
            <Switch
              checked={field.state.value}
              colorScheme="emerald"
              onChange={(e) => field.handleChange(e.target.checked)}
              size="lg"
            >
              <Text>センシティブチャンネルを除外</Text>
            </Switch>
          )}
        </form.Field>
      </VStack>

      <Separator />

      {/* 送信ボタン */}
      <HStack alignSelf="end">
        <Button
          colorScheme="emerald"
          loading={form.state.isSubmitting}
          size="lg"
          type="submit"
          variant="surface"
        >
          <Text>{isCreate ? "作成" : "更新"}</Text>
        </Button>
        {!isCreate && (
          <DeleteAntennaButton antennaId={antenna.id} name={antenna.name} />
        )}
      </HStack>
    </VStack>
  );
};
