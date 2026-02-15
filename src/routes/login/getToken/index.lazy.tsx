import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import type { MeDetailed } from "misskey-js/entities.js";
import { useEffect, useRef } from "react";
import { Loader } from "@/components/common/Loader";
import { useLoginStore } from "@/store/login";
import { reportInternalError } from "@/utils/appError";
import { getApiUrl } from "@/utils/getApiUrl";

export const Route = createLazyFileRoute("/login/getToken/")({
  component: GetToken,
});

function GetToken() {
  const { session } = Route.useSearch();
  const navigate = useNavigate();
  const instance = useLoginStore((state) => state.instance);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!session) {
      navigate({ replace: true, to: "/login" });
      return;
    }

    if (!instance) {
      navigate({ replace: true, to: "/login" });
      return;
    }

    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const tokenUrl = `https://${instance}/api/miauth/${session}/check`;

    void fetchData(tokenUrl)
      .then((isSuccess) => {
        if (isSuccess) {
          navigate({ replace: true, to: "/" });
          return;
        }

        navigate({ replace: true, to: "/login" });
      })
      .catch((error) => {
        reportInternalError("login-get-token", error);
        navigate({ replace: true, to: "/login" });
      });
  }, [instance, navigate, session]);

  return <Loader />;
}

const fetchData = async (tokenUrl: string): Promise<boolean> => {
  const setLogin = useLoginStore.setState;

  const res = await fetch(tokenUrl, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  if (!data.token) {
    return false;
  }

  const ires = await fetch(getApiUrl("i"), {
    body: JSON.stringify({
      i: data.token,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!ires.ok) {
    throw new Error(`${ires.status} ${ires.statusText}`);
  }

  const me: MeDetailed = await ires.json();

  setLogin((state) => ({
    ...state,
    isLogin: true,
    mySelf: me,
    token: data.token,
  }));

  return true;
};
