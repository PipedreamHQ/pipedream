// legacy_hash_id: a_Mdizkz
import { axios } from "@pipedream/platform";

export default {
  key: "smugmug-get-image",
  name: "Get Image",
  description: "Gets an image. An image is a photo or video stored on SmugMug.",
  version: "0.1.1",
  type: "action",
  props: {
    smugmug: {
      type: "app",
      app: "smugmug",
    },
    image_key: {
      type: "string",
      description: "Key of the image to retrieve.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://api.smugmug.com/api/v2/doc/reference/image.html

    const config = {
      url: `https://www.smugmug.com/api/v2/image/${this.image_key}`,
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
