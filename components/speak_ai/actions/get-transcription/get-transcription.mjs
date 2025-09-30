import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-get-transcription",
  name: "Get Transcription",
  description: "Retrieve the full transcription of a processed media file. [See the documentation](https://docs.speakai.co/#0b586e5b-6e0a-4b79-b440-e6889a803ccd).",
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
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      mediaId,
    } = this;

    const response = await app.getInsight({
      $,
      mediaId,
    });

    $.export("$summary", `Successfully retrieved transcription for media ID \`${response.data.mediaId}\`.`);
    return response.data.insight.transcript;
  },
};
