import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Loader } from "@/components/common/Loader";
import type { LoginState } from "@/store/login";
import { useLoginStore } from "@/store/login";
import { getApiUrl } from "@/utils/getApiUrl";
import type { MeDetailed } from "misskey-js/entities.js";

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

  return <Loader />;
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
      const ires = await fetch(getApiUrl("i"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          i: data.token,
        }),
      });
      const me: MeDetailed = await ires.json();

      setLogin({
        ...login,
        isLogin: true,
        token: data.token,
        mySelf: me,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
