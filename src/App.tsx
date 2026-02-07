import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ColorModeScript, UIProvider } from "@yamada-ui/react";
import { Provider as JotaiProvider } from "jotai";
import type { MeDetailed } from "misskey-js/entities.js";
import { useEffect, useMemo } from "react";
import { routeTree } from "./routeTree.gen.ts";
import { useFontStore } from "./store/font.ts";
import { type LoginState, useLoginStore } from "./store/login.ts";
import { createCustomTheme, customConfig } from "./theme/index.ts";
import { getApiUrl } from "./utils/getApiUrl.ts";
import { getFetchObject } from "./utils/getFetchObject.ts";
import "mfm-react-render/style.css";

const queryClient = new QueryClient();

export type RouterContext = { auth: LoginState; queryClient: QueryClient };

const router = createRouter({
  context: {
    auth: undefined!,
    queryClient: queryClient,
  },
  defaultPreload: "intent",
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const loginStore = useLoginStore();
  const { fontValue } = useFontStore();

  const customTheme = useMemo(() => createCustomTheme(fontValue), [fontValue]);

  useEffect(() => {
    if (!loginStore.isLogin || !loginStore.token) return;

    const fetchMySelf = async () => {
      try {
        const res = await fetch(getApiUrl("i"), getFetchObject(undefined));
        if (!res.ok) return;
        const me: MeDetailed = await res.json();
        useLoginStore.getState().setMySelf(me);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchInstanceEmojis = async () => {
      try {
        const res = await fetch(
          getApiUrl("emojis"),
          getFetchObject(undefined),
        );
        if (!res.ok) return;
        const data: { emojis: { name: string; url: string }[] } =
          await res.json();
        const emojiMap: { [key: string]: string } = {};
        for (const emoji of data.emojis) {
          emojiMap[emoji.name] = emoji.url;
        }
        useLoginStore.getState().setInstanceEmojis(emojiMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMySelf();
    fetchInstanceEmojis();
  }, [loginStore.isLogin, loginStore.token]);

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <UIProvider config={customConfig} theme={customTheme}>
          <ColorModeScript />
          <RouterProvider context={{ auth: loginStore }} router={router} />
        </UIProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
