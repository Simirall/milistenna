import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/antenna/$edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { edit } = Route.useParams();
  return `Hello /_auth/_layout/antenna/${edit}!`;
}
