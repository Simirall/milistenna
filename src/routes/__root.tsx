import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { RouterContext } from "@/App";
import { Header } from "@/components/layout/Header";
import { Container } from "@yamada-ui/react";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Header />
      <Container px={{ base: "20vw", md: "md" }} py="md">
        <Outlet />
      </Container>
    </>
  ),
});
