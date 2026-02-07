import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ColorModeScript, UIProvider } from "@yamada-ui/react";
import type { MeDetailed } from "misskey-js/entities.js";
import { useEffect } from "react";
import { routeTree } from "./routeTree.gen.ts";
import { type LoginState, useLoginStore } from "./store/login.ts";
import { customConfig, customTheme } from "./theme/index.ts";
import { getApiUrl } from "./utils/getApiUrl.ts";
import { getFetchObject } from "./utils/getFetchObject.ts";

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

    fetchMySelf();
  }, [loginStore.isLogin, loginStore.token]);

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider config={customConfig} theme={customTheme}>
        <ColorModeScript />
        <RouterProvider context={{ auth: loginStore }} router={router} />
      </UIProvider>
    </QueryClientProvider>
  );
}
