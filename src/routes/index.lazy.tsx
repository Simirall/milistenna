import { useMySelfStore } from "@/store/user";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Heading } from "@yamada-ui/react";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mySelf } = useMySelfStore();
  return (
    <>
      <Heading>{`Hello ! ${mySelf?.name}`}</Heading>
    </>
  );
}
