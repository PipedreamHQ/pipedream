// legacy_hash_id: a_xqiqM0
import { axios } from "@pipedream/platform";

export default {
  key: "smugmug-get-user-profile",
  name: "Get User Profile",
  description: "Gets a user profile. A user profile is the data provided by a user to establish that user's public presence. This may include social networking links, biographical text, and bio and cover images.",
  version: "0.2.1",
  type: "action",
  props: {
    smugmug: {
      type: "app",
      app: "smugmug",
    },
    nickname: {
      type: "string",
      description: "Nickname of the user's profile to query.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://api.smugmug.com/api/v2/user/cmac!profile

    const config = {
      url: `https://www.smugmug.com/api/v2/user/${this.nickname}!profile`,
      headers: {
        Accept: "application/json",
      },
    };

    const signature = {
      token: {
        key: this.smugmug.$auth.oauth_access_token,
        secret: this.smugmug.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.smugmug.$auth.oauth_signer_uri,
    };

    return await axios($, config, signature);
  },
};
