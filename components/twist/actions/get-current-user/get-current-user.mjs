// legacy_hash_id: a_0Mi2Pj
import { axios } from "@pipedream/platform";

export default {
  key: "twist-get-current-user",
  name: "Get Current User",
  description: "Gets the associated user for access token used in the request.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twist: {
      type: "app",
      app: "twist",
    },
  },
  async run({ $ }) {
  //See the API docs: https://api.twistapp.com/v3/#get-current-user

    return await axios($, {
      url: "https://api.twist.com/api/v3/users/get_session_user",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
    });
  },
};
