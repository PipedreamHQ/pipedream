import { axios } from "@pipedream/platform";

export default function ({
  $, ...args
}) {
  return axios($, {
    ...args,
    baseURL: "https://graph.microsoft.com/v1.0/me/drive",
    headers: {
      ...args.headers,
      Authorization: `Bearer ${this.onedrive.$auth.oauth_access_token}`,
    },
  });
}
