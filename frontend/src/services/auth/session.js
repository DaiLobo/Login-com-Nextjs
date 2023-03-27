import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { authService } from "./authService";

export function withSession(funcao) {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const modifiedCtx = {
        ...ctx,
        req: {
          ...ctx.req,
          session,
        },
      };

      return funcao(modifiedCtx);
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: "/?error=401",
        },
      };
    }
  };
}

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authService
      .getSession()
      .then((response) => {
        setSession(response);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(setLoading(false));
  }, []);

  return {
    data: session,
    error,
    loading,
  };
}

export function withSessionHOC(Component) {
  return function Wrapper(props) {
    const router = useRouter();
    const { loading, error, data } = useSession();

    if (error) {
      router.push("/?error=401");
    }

    const modifiedProps = {
      ...props,
      session: data,
    };
    return <Component {...modifiedProps} />;
  };
}
