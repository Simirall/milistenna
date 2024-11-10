import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Input, Text, VStack } from "@yamada-ui/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import z from "zod";

import { appName } from "@/constants/appName";
import { useLoginStore } from "@/store/login";

const LoginSchema = z.object({
  instance: z.string().min(1).max(255),
});

type LoginType = z.infer<typeof LoginSchema>;

export const Route = createFileRoute("/login/_layout/")({
  component: Login,
});

function Login() {
  const [loginError, setLoginError] = useState<string | undefined>();

  const form = useForm<LoginType>({
    defaultValues: {
      instance: "",
    },
    onSubmit: async ({ value }) => {
      authApplication({ loginData: value, setLoginError: setLoginError });
    },
  });

  return (
    <VStack p="md">
      <Text>ログインページです。</Text>
      <VStack
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="instance">
          {(field) => (
            <Input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="misskey.example"
            />
          )}
        </form.Field>
        <Button type="submit" colorScheme="sky">
          次へ
        </Button>
        {loginError && <p>{loginError}</p>}
      </VStack>
    </VStack>
  );
}

const authApplication = async ({
  loginData,
  setLoginError,
}: {
  loginData: LoginType;
  setLoginError: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const id = uuid();
  const appURL = `${document.location.href}/getToken`;
  const checkEndpointURL = `https://${loginData.instance}/api/endpoints`;
  const login = useLoginStore.getState();
  const setLogin = useLoginStore.setState;

  try {
    const res = await fetch(checkEndpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      throw new Error();
    }
    const endpoints: ReadonlyArray<string> = await res.json();
    if (!endpoints.includes("miauth/gen-token")) {
      setLoginError("インスタンスがMiAuthに対応していないようです。");
      return;
    }
    setLogin({
      ...login,
      instance: loginData.instance,
    });
    const authURL = `https://${encodeURIComponent(loginData.instance)}/miauth/${id}?name=${appName}&callback=${appURL}&icon=${encodeURIComponent("https://raw.githubusercontent.com/Simirall/milistenna/refs/heads/main/public/192.png")}&permission=read:account,write:account,read:following`;
    window.location.href = authURL;
  } catch (e) {
    setLoginError("それは正しいMisskeyインスタンスですか？");
  }
};
