import type { MeDetailed } from "misskey-js/entities.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** インスタンスの絵文字マップ（name → url） */
export type InstanceEmojis = { [key: string]: string };

export type LoginState = {
  isLogin: boolean;
  token?: string;
  instance?: string;
  mySelf?: MeDetailed;
  instanceEmojis?: InstanceEmojis;
};

type LoginActions = {
  login: (payload: Required<Omit<LoginState, "isLogin" | "mySelf" | "instanceEmojis">>) => void;
  setMySelf: (payload: MeDetailed) => void;
  setInstanceEmojis: (payload: InstanceEmojis) => void;
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
          instanceEmojis: undefined,
          isLogin: false,
          mySelf: undefined,
        }));
      },
      setInstanceEmojis: (payload) =>
        set({
          instanceEmojis: payload,
        }),
      setMySelf: (payload) =>
        set({
          mySelf: payload,
        }),
    }),
    { name: "login" },
  ),
);
