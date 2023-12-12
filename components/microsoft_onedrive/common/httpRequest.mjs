import { axios } from "@pipedream/platform";

export default function ({
  $, ...args
}) {
  let baseURL = "https://graph.microsoft.com/v1.0/me/drive";
  if (args.useSharedDrive) {
    baseURL = "https://graph.microsoft.com/v1.0";
  }
  return axios($, {
    ...args,
    baseURL,
    headers: {
      ...args.headers,
      Authorization: `Bearer ${this.onedrive.$auth.oauth_access_token}`,
    },
  });
}
