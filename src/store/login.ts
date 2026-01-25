import type { MeDetailed } from "misskey-js/entities.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LoginState = {
  isLogin: boolean;
  token?: string;
  instance?: string;
  mySelf?: MeDetailed;
};

type LoginActions = {
  login: (payload: Required<Omit<LoginState, "isLogin" | "mySelf">>) => void;
  setMySelf: (payload: MeDetailed) => void;
  logout: () => void;
};

export const useLoginStore = create<LoginState & LoginActions>()(
  persist(
    (set) => ({
      isLogin: false,
      login: (payload) =>
        set(() => ({
          isLogin: true,
          ...payload,
        })),
      logout: () => {
        set(() => ({
          instance: undefined,
          isLogin: false,
          mySelf: undefined,
        }));
      },
      setMySelf: (payload) =>
        set({
          mySelf: payload,
        }),
    }),
    { name: "login" },
  ),
);
