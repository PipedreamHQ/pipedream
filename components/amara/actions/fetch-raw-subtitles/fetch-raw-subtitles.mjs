import amara from "../../amara.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-fetch-raw-subtitles",
  name: "Fetch Raw Subtitles",
  description: "Fetch raw subtitles. [See the docs here](https://apidocs.amara.org/#fetch-raw-subtitles)",
  type: "action",
  version: "0.0.4",
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
    format: {
      description: "The format to return the subtitles in. This can be any format that amara supports including `dfxp`, `srt`, `vtt`, and `sbv`.",
      optional: false,
      propDefinition: [
        amara,
        "subFormat",
        () => ({
          notAllowedFormats: [
            constants.FORMAT_TYPES.JSON,
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
      format,
    } = this;

    const response = await this.amara.getRawSubtitles({
      $,
      videoId,
      language,
      format,
    });

    $.export("$summary", "Successfully fetched raw subtitles");

    return response;
  },
};
