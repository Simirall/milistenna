import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ColorModeScript, UIProvider } from "@yamada-ui/react";
import { routeTree } from "./routeTree.gen.ts";
import { type LoginState, useLoginStore } from "./store/login.ts";
import { customConfig, customTheme } from "./theme/index.ts";

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

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider config={customConfig} theme={customTheme}>
        <ColorModeScript />
        <RouterProvider context={{ auth: loginStore }} router={router} />
      </UIProvider>
    </QueryClientProvider>
  );
}
