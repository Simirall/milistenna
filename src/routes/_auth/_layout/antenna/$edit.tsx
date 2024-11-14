import { antennaShowQueryOptions } from "@/apis/antennas/useGetAntennasShow";
import { isError } from "@/utils/isError";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/antenna/$edit")({
  beforeLoad: async ({ params, context }) => {
    if (params.edit === "create") {
      return;
    }

    const res = await context.queryClient.ensureQueryData(
      antennaShowQueryOptions(params.edit),
    );
    // エラーの場合リダイレクト
    if (isError(res)) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
