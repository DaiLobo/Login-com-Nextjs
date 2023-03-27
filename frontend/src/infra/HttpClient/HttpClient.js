import { tokenService } from "../../services/auth/tokenService";

export const HttpClient = async (fetchUrl, fetchOptions) => {
  return fetch(fetchUrl, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  })
    .then(async (response) => {
      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: await response.json(),
      };
    })
    .then(async (response) => {
      if (!fetchOptions.refresh) return response;
      if (response.status !== 401) return response;

      const refreshResponse = await HttpClient(
        "http://localhost:3000/api/refresh",
        {
          method: "GET",
        }
      );

      const newAccessToken = refreshResponse.body.data.access_token;
      const newRefreshToken = refreshResponse.body.data.refresh_token;

      tokenService.save(newAccessToken);

      const retryResponse = await HttpClient(fetchUrl, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
        body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
        refresh: false,
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return retryResponse;
    });
};
