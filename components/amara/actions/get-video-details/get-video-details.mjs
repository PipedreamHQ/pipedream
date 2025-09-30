import amara from "../../amara.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-get-video-details",
  name: "Get Video Details",
  description: "Get video details. [See the docs here](https://apidocs.amara.org/#view-video-details)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amara,
    team: {
      propDefinition: [
        amara,
        "team",
      ],
    },
    videoId: {
      propDefinition: [
        amara,
        "videoId",
        ({ team }) => ({
          team: utils.emptyStrToUndefined(team),
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.amara.getVideo({
      $,
      videoId: this.videoId,
    });

    $.export("$summary", `Successfully fetched video details for "${response.title}"`);

    return response;
  },
};
