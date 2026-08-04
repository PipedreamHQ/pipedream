import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-get-transcription",
  name: "Get Transcription",
  description: "Retrieve the full transcription of a processed media file. [See the documentation](https://docs.speakai.co/api/media/#get-media-insight-media-id).",
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
        }),
      ],
      description: "The media file to retrieve the full transcription for",
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
