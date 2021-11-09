import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-perform-action",
  name: "Perform action",
  description: "Perform an action on the subtitles. This is equivalent to opening the editor, not changing the subtitles, and clicking an actions button. [See the docs here](https://apidocs.amara.org/#perform-actions)",
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
    action: {
      propDefinition: [
        amara,
        "action",
        ({
          videoId, language,
        }) => ({
          videoId,
          language,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
      action,
    } = this;

    const response = await this.amara.performAction({
      $,
      videoId,
      language,
      action,
    });

    if (!response) {
      return {
        id: videoId,
        action,
        success: true,
      };
    }

    return response;
  },
};
