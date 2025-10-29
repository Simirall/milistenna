import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Container } from "@yamada-ui/react";
import type { RouterContext } from "@/App";
import { Header } from "@/components/layout/Header";

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
