import { useLoginStore } from "@/store/login";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Heading } from "@yamada-ui/react";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mySelf } = useLoginStore();
  return (
    <>
      <Heading>{`Hello ! ${mySelf?.name}`}</Heading>
    </>
  );
}
