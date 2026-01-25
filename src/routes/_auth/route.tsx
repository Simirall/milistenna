import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogin) {
      throw redirect({ replace: true, to: "/login" });
    }
  },
});
