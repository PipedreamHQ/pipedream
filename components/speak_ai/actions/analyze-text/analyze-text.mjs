import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-analyze-text",
  name: "Analyze Text",
  description: "Analyzes a block of text for key insights, sentiment, and keyword extraction using Speak Ai's NLP engine. [See the documentation](https://docs.speakai.co/#d65573c9-98ad-4089-93ad-9d0a173fdeea).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
    mediaId: {
      propDefinition: [
        app,
        "mediaId",
        ({ folderId }) => ({
          folderId,
          mediaType: "text",
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      mediaId,
    } = this;

    const response = await app.getTextInsight({
      $,
      mediaId,
    });

    $.export("$summary", `Successfully analyzed text with ID \`${response.data.mediaId}\`.`);
    return response;
  },
};
