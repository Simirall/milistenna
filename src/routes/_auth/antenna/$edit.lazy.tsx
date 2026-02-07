import { CaretLeftIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Field,
  Heading,
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
import { useGetAntennasList } from "@/apis/antennas/useGetAntennasList";
import { useGetAntennasShow } from "@/apis/antennas/useGetAntennasShow";
import { useGetUsersListsShow } from "@/apis/lists/useGetUsersListsShow";
import { FloatLinkButton } from "@/components/common/FloatLinkButton";
import { Loader } from "@/components/common/Loader";
import { getApiUrl } from "@/utils/getApiUrl";
import { getFetchObject } from "@/utils/getFetchObject";
import { isError } from "@/utils/isError";
import { SelectListField } from "./-components/SelectListModal";

export const Route = createLazyFileRoute("/_auth/antenna/$edit")({
  component: RouteComponent,
});

/** 受信ソースの選択肢 */
const srcOptions: { label: string; value: Antenna["src"] }[] = [
  { label: "すべてのノート", value: "all" },
  { label: "指定したユーザー", value: "users" },
  { label: "指定したユーザーを除外", value: "users_blacklist" },
  { label: "リスト", value: "list" },
];

/**
 * キーワード2次元配列を表示用文字列に変換する
 * 内側の配列（AND条件）はスペース区切り、外側の配列（OR条件）は改行区切り
 */
const keywordsToString = (keywords: string[][]): string =>
  keywords.map((andGroup) => andGroup.join(" ")).join("\n");

/**
 * 表示用文字列をキーワード2次元配列に変換する
 */
const stringToKeywords = (str: string): string[][] =>
  str
    .split("\n")
    .map((line) => line.split(/\s+/).filter(Boolean))
    .filter((group) => group.length > 0);

function RouteComponent() {
  const { edit } = Route.useParams();
  const isCreate = edit === "create";
  const { antenna } = useGetAntennasShow(edit);
  const { list } = useGetUsersListsShow(
    (!isCreate && antenna && !isError(antenna) && antenna.userListId) || "",
  );

  // 編集モードでデータ取得中はローダーを表示
  if (!isCreate && (!antenna || isError(antenna))) {
    return <Loader />;
  }

  // リストソースの場合、リスト名の取得を待つ
  const antennaData = isCreate ? undefined : (antenna as Antenna);
  const initialListName =
    antennaData?.src === "list" && list && !isError(list) ? list.name : "";

  return (
    <>
      <VStack>
        <Heading size="lg">
          {isCreate ? "アンテナ作成" : `${antennaData?.name} の編集`}
        </Heading>
        <AntennaForm antenna={antennaData} initialListName={initialListName} />
      </VStack>
      <FloatLinkButton
        colorScheme="sky"
        linkProps={{
          to: "/antenna",
        }}
        position="left"
      >
        <CaretLeftIcon fontSize="1em" weight="bold" />
      </FloatLinkButton>
    </>
  );
}

type AntennaFormProps = {
  antenna?: Antenna;
  initialListName: string;
};

const AntennaForm = ({ antenna, initialListName }: AntennaFormProps) => {
  const isCreate = !antenna;
  const navigate = useNavigate();
  const { refetch } = useGetAntennasList();

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
          name: value.name,
          src: value.src,
          userListId: value.src === "list" ? value.userListId : null,
          users:
            value.src === "users" || value.src === "users_blacklist"
              ? value.users.split("\n").filter(Boolean)
              : [],
          keywords: stringToKeywords(value.keywords),
          excludeKeywords: stringToKeywords(value.excludeKeywords),
          caseSensitive: value.caseSensitive,
          localOnly: value.localOnly,
          excludeBots: value.excludeBots,
          withReplies: value.withReplies,
          withFile: value.withFile,
          excludeNotesInSensitiveChannel: value.excludeNotesInSensitiveChannel,
        };
        await fetch(
          getApiUrl("antennas/create"),
          getFetchObject<AntennasCreateRequest>(payload),
        );
      } else {
        const payload: AntennasUpdateRequest = {
          antennaId: antenna.id,
          name: value.name,
          src: value.src,
          userListId: value.src === "list" ? value.userListId : null,
          users:
            value.src === "users" || value.src === "users_blacklist"
              ? value.users.split("\n").filter(Boolean)
              : [],
          keywords: stringToKeywords(value.keywords),
          excludeKeywords: stringToKeywords(value.excludeKeywords),
          caseSensitive: value.caseSensitive,
          localOnly: value.localOnly,
          excludeBots: value.excludeBots,
          withReplies: value.withReplies,
          withFile: value.withFile,
          excludeNotesInSensitiveChannel: value.excludeNotesInSensitiveChannel,
        };
        await fetch(
          getApiUrl("antennas/update"),
          getFetchObject<AntennasUpdateRequest>(payload),
        );
      }
      await refetch();
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
                >
                  <Textarea
                    autosize
                    minRows={3}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={"@user@example.com"}
                    value={field.state.value}
                    required
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
            <form.Field name="userListId">
              {(listIdField) => (
                <form.Field name="userListName">
                  {(listNameField) => (
                    <Field.Root label="リスト">
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
          >
            <Textarea
              autosize
              minRows={3}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={"foo bar\nbaz"}
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
              colorScheme="teal"
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
              colorScheme="teal"
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
              colorScheme="teal"
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
              colorScheme="teal"
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
              colorScheme="teal"
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
              colorScheme="teal"
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
      <HStack>
        <Button
          colorScheme="cyan"
          loading={form.state.isSubmitting}
          size="lg"
          type="submit"
          variant="surface"
        >
          <Text>{isCreate ? "作成" : "更新"}</Text>
        </Button>
      </HStack>
    </VStack>
  );
};
