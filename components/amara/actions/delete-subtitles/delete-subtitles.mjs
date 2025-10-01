import amara from "../../amara.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-delete-subtitles",
  name: "Delete Subtitles",
  description: "Delete all subtitle versions for a language. [See the docs here](https://apidocs.amara.org/#delete-subtitles)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    language: {
      propDefinition: [
        amara,
        "language",
        ({ videoId }) => ({
          videoId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
    } = this;

    const response = await this.amara.deleteSubtitles({
      $,
      videoId,
      language,
    });

    if (!response) {
      $.export("$summary", "Successfully deleted subtitles");

      return {
        id: videoId,
        success: true,
      };
    }

    return response;
  },
};
