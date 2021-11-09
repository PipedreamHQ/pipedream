import amara from "../../amara.app.mjs";
import constants from "../../constants.mjs";

export default {
  key: "amara-fetch-raw-subtitles",
  name: "Fetch raw subtitles",
  description: "Fetch raw subtitles. [See the docs here](https://apidocs.amara.org/#fetch-raw-subtitles)",
  type: "action",
  version: "0.0.1",
  props: {
    amara,
    videoId: {
      propDefinition: [
        amara,
        "videoId",
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

    return await this.amara.getRawSubtitles({
      $,
      videoId,
      language,
      format,
    });
  },
};
