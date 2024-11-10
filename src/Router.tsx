import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { useLoginStore } from "./store/login";
import type { LoginState } from "./store/login";

export type RouterContext = { auth: LoginState };

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
});

export const Router = () => {
  const loginStore = useLoginStore();

  return (
    <>
      <RouterProvider router={router} context={{ auth: loginStore }} />
    </>
  );
};
