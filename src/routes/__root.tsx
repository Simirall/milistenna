import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { RouterContext } from "@/Router";
import { Header } from "@/components/Header";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});
