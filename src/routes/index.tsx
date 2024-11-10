import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogin) {
      throw redirect({ to: "/login", replace: true });
    }
  },
});
