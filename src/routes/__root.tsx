import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Box } from "@yamada-ui/react";
import type { RouterContext } from "@/App";
import { Header } from "@/components/common/layout/Header";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Box display="grid" gridTemplateRows="auto 1fr" minH="100vh">
      <Header />
      <Box bg="bg.subtle" px={{ base: "20vw", md: "md" }} py="md">
        <Box
          as="main"
          bg="bg.float"
          borderRadius="md"
          minH="full"
          p="md"
          shadow="md"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  ),
});
