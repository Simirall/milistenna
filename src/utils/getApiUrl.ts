import type { Endpoints } from "misskey-js/api.types.d.ts";
import { useLoginStore } from "@/store/login";

export const getApiUrl = (endpoint: keyof Endpoints) =>
  `https://${useLoginStore.getState().instance}/api/${endpoint}`;
