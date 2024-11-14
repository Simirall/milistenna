import type { Endpoints } from "misskey-js/api.types.d.ts";
import { getApiUrl } from "./getApiUrl";
import { getFetchObject } from "./getFetchObject";

export const fetcher =
  (endpoint: keyof Endpoints, obj: Record<string, unknown> = {}) =>
  async () => {
    const res = await fetch(getApiUrl(endpoint), getFetchObject(obj));
    return await res.json();
  };
