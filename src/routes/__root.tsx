import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Box } from "@yamada-ui/react";
import type { RouterContext } from "@/App";
import { Header } from "@/components/Header";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Box display="grid" gridTemplateRows="auto 1fr" minH="100svh">
      <Header />
      <Box bg="bg.subtle" minW={0} px={{ base: "20vw", md: "md" }} py="md">
        <Box
          as="main"
          bg="bg.float"
          borderRadius="md"
          display="grid"
          gridTemplateRows="1fr"
          minH="full"
          overflow="hidden"
          p="md"
          pb="20"
          shadow="md"
        >
          <Box minW={0}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  ),
});
