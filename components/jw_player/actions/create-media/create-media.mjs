import axios from "@pipedream/platform";
import jwPlayer from "../../jw_player.app.mjs";

export default {
  key: "jw_player-create-media",
  name: "Create Media",
  description: "Creates a new media file in JW Player using fetch or external upload methods",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jwPlayer,
    methodType: {
      propDefinition: [
        jwPlayer,
        "methodType",
      ],
    },
    mediaSource: {
      propDefinition: [
        jwPlayer,
        "mediaSource",
      ],
    },
  },
  async run({ $ }) {
    const response = await axios($, {
      method: "POST",
      url: `${this.jwPlayer._baseUrl()}/v2/sites/${this.jwPlayer.$auth.site_id}/media/`,
      headers: {
        "Authorization": `Bearer ${this.jwPlayer.$auth.oauth_access_token}`,
      },
      data: {
        upload: {
          method: this.methodType,
          download_url: this.mediaSource,
        },
      },
    });
    $.export("$summary", "Successfully created media");
    return response;
  },
};
