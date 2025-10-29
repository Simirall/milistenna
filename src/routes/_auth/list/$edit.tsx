import { createFileRoute, redirect } from "@tanstack/react-router";
import { usersListsShowQueryOptions } from "@/apis/lists/useGetUsersListsShow";
import { isError } from "@/utils/isError";

export const Route = createFileRoute("/_auth/list/$edit")({
  beforeLoad: async ({ params, context }) => {
    if (params.edit === "create") {
      return;
    }

    const res = await context.queryClient.ensureQueryData(
      usersListsShowQueryOptions(params.edit),
    );
    // エラーの場合リダイレクト
    if (isError(res)) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
