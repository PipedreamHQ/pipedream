import amara from "../../amara.app.mjs";

export default {
  key: "amara-perform-action",
  name: "Perform Action",
  description: "Perform an action on the subtitles. This is equivalent to opening the editor, not changing the subtitles, and clicking an actions button. [See the docs here](https://apidocs.amara.org/#perform-actions)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
          team,
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
      $.export("$summary", `Successfully performed ${action} action`);

      return {
        id: videoId,
        action,
        success: true,
      };
    }

    return response;
  },
};
