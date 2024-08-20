import { axios } from "@pipedream/platform";

export default function ({
  $ = this, ...args
}) {
  let baseURL = "https://graph.microsoft.com/v1.0/me/drive";
  if (args.useSharedDrive) {
    baseURL = "https://graph.microsoft.com/v1.0";
  }
  const { oauth_access_token: token } = this.$auth || this.onedrive.$auth;
  return axios($, {
    ...args,
    baseURL,
    headers: {
      ...args.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
