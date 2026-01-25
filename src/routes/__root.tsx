import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Box } from "@yamada-ui/react";
import type { RouterContext } from "@/App";
import { Header } from "@/components/common/layout/Header";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Box display="grid" gridTemplateRows="auto 1fr" minH="100vh">
      <Header />
      <Box px={{ base: "20vw", md: "0" }} bg="bg.subtle" py="md">
        <Box
          as="main"
          minH="full"
          p="md"
          bg="bg.float"
          borderRadius="md"
          shadow="md"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  ),
});
