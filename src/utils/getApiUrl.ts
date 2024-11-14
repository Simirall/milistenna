import { useLoginStore } from "@/store/login";
import type { Endpoints } from "misskey-js/api.types.d.ts";

export const getApiUrl = (endpoint: keyof Endpoints) =>
  `https://${useLoginStore.getState().instance}/api/${endpoint}`;
