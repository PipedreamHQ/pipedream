// legacy_hash_id: a_B0ip6w
import { axios } from "@pipedream/platform";

export default {
  key: "smugmug-get-album",
  name: "Get Album",
  description: "Gets an album given its id.",
  version: "0.1.1",
  type: "action",
  props: {
    smugmug: {
      type: "app",
      app: "smugmug",
    },
    album_id: {
      type: "string",
      description: "Id  of the album to retrieve.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://api.smugmug.com/api/v2/doc/reference/album.html

    const config = {
      url: `https://www.smugmug.com/api/v2/album/${this.album_id}`,
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
