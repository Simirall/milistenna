import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLogin) {
      throw redirect({ replace: true, to: "/" });
    }
  },
});
