import { usersListsShowQueryOptions } from "@/apis/lists/useGetUsersListsShow";
import { isError } from "@/utils/isError";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/list/$edit")({
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
