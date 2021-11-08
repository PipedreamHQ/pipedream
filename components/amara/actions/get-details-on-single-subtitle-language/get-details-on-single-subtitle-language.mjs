import amara from "../../amara.app.mjs";

export default {
  key: "amara-get-details-on-single-subtitle-language",
  name: "Get details on a single subtitle language",
  description: "Get details on a single subtitle language. [See the docs here](https://apidocs.amara.org/#get-details-on-a-single-subtitle-language)",
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
  },
  async run({ $ }) {
    const {
      videoId,
      language,
    } = this;

    return await this.amara.getSubtitleLanguage({
      $,
      videoId,
      language,
    });
  },
};
