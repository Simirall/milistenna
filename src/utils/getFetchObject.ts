import { useLoginStore } from "@/store/login";

export const getFetchObject = <T = undefined | Record<string, unknown>>(
  obj: T,
) => ({
  body: JSON.stringify({
    i: useLoginStore.getState().token,
    ...obj,
  }),
  headers: {
    "Content-Type": "application/json",
  },
  method: "POST",
});
