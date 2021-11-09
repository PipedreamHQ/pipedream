import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-delete-subtitles",
  name: "Delete subtitles",
  description: "Delete subtitles. [See the docs here](https://apidocs.amara.org/#delete-subtitles)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
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

    const response = await this.amara.deleteSubtitles({
      $,
      videoId,
      language,
    });

    if (!response) {
      return {
        id: videoId,
        success: true,
      };
    }

    return response;
  },
};
