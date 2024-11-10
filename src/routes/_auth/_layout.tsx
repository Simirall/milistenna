import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogin) {
      throw redirect({ to: "/login", replace: true });
    }
  },
});
