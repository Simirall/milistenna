import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const sessionSearchSchema = z.object({
  session: z.uuid(),
});

export const Route = createFileRoute("/login/getToken/")({
  validateSearch: sessionSearchSchema,
});
