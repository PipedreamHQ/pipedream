import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-fetch-subtitles-data",
  name: "Fetch subtitles data",
  description: "Fetch subtitles data. [See the docs here](https://apidocs.amara.org/#fetch-subtitles-data)",
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
    versionNumber: {
      propDefinition: [
        amara,
        "versionNumber",
        ({
          videoId, language,
        }) => ({
          videoId,
          language,
        }),
      ],
    },
    subFormat: {
      propDefinition: [
        amara,
        "subFormat",
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
      versionNumber,
      subFormat,
    } = this;

    return await this.amara.getSubtitles({
      $,
      videoId,
      language,
      params: {
        version_number: versionNumber,
        sub_format: subFormat,
      },
    });
  },
};
