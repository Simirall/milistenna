import { useLoginStore } from "@/store/login";

export const getFetchObject = (obj: Record<string, unknown> = {}) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    i: useLoginStore.getState().token,
    ...obj,
  }),
});
