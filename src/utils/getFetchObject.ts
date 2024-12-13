import { useLoginStore } from "@/store/login";

export const getFetchObject = <T = undefined | Record<string, unknown>>(
  obj: T,
) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    i: useLoginStore.getState().token,
    ...obj,
  }),
});
