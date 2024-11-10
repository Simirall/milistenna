import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import type { LoginState } from "@/store/login";
import { useLoginStore } from "@/store/login";

export const Route = createLazyFileRoute("/login/_layout/getToken")({
  component: GetToken,
});

function GetToken() {
  const { session } = Route.useSearch();
  const navigate = useNavigate();
  const login = useLoginStore();

  const tokenUrl = `https://${login.instance}/api/miauth/${session}/check`;
  fetchData(tokenUrl, login);

  useEffect(() => {
    if (login.isLogin) {
      navigate({ to: "/", replace: true });
    }
  }, [login, navigate]);

  return <>loading...</>;
}

const fetchData = async (tokenUrl: string, login: LoginState) => {
  const setLogin = useLoginStore.setState;

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    if (data.token) {
      setLogin({
        ...login,
        isLogin: true,
        token: data.token,
        mySelf: data.user,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
