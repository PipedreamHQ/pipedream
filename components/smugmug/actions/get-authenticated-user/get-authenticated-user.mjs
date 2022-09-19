// legacy_hash_id: a_Q3i5Mm
import { axios } from "@pipedream/platform";

export default {
  key: "smugmug-get-authenticated-user",
  name: "Get Authenticated User",
  description: "Gets details of the authenticated user.",
  version: "0.1.1",
  type: "action",
  props: {
    smugmug: {
      type: "app",
      app: "smugmug",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.smugmug.com/api/v2!authuser",
      headers: {
        "Accept": "application/json",
      },
    }, {
      token: {
        key: this.smugmug.$auth.oauth_access_token,
        secret: this.smugmug.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.smugmug.$auth.oauth_signer_uri,
    });
  },
};
