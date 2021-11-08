import amara from "../../amara.app.mjs";

export default {
  key: "amara-list-subtitle-languages-for-video",
  name: "List subtitle languages for a video",
  description: "Get a list of subtitle languages for a video. [See the docs here](https://apidocs.amara.org/#list-subtitle-languages-for-a-video)",
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
    limit: {
      propDefinition: [
        amara,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      limit,
    } = this;

    const { objects: languages } = await this.amara.getVideoSubtitleLanguages({
      $,
      videoId,
      params: {
        limit,
      },
    });

    return languages;
  },
};
