import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-analyze-text",
  name: "Analyze Text",
  description: "Retrieve the insights Speak AI generated for a text note: sentiment, keywords and named entities. The note must already exist in Speak AI; select it with the Media ID prop. [See the documentation](https://docs.speakai.co/api/text/#get-text-insight-media-id).",
  version: "0.0.3",
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
