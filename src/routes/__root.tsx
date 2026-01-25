import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Box } from "@yamada-ui/react";
import type { RouterContext } from "@/App";
import { Header } from "@/components/layout/Header";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Header />
      <Box px={{ base: "20vw", md: "md" }} py="md">
        <Outlet />
      </Box>
    </>
  ),
});
