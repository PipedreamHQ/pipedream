import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export function authHeaders($auth) {
  return {
    Authorization: `Bearer ${$auth.api_key}`,
    Accept: "application/json",
  };
}

export async function fonciqRequest($, $auth, {
  method = "GET",
  path,
  params,
  data,
  headers = {},
}) {
  return axios($, {
    method,
    url: `${constants.API_BASE}${path}`,
    params,
    data,
    headers: {
      ...authHeaders($auth),
      ...headers,
    },
  });
}

export function newIdempotencyKey() {
  return crypto.randomUUID();
}
