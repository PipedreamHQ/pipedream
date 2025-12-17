// legacy_hash_id: a_Q3iw4N
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-view-user",
  name: "View User",
  description: "View your user information",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.zoom.us/v2/users/me",
      headers: {
        Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
      },
    });
  },
};
