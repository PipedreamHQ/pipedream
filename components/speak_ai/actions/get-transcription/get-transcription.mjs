import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-get-transcription",
  name: "Get Transcription",
  description: "Retrieve just the transcript of a processed Speak AI media file, as an array of speaker-attributed segments. Use **Find Media** instead to get sentiment, keywords and the rest of the analysis. [See the documentation](https://docs.speakai.co/api/media/#get-media-transcript-media-id).",
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
      description: "A Speak AI media ID, for example `b4994aa1267c`. Get it from the `mediaId` field returned by Speak AI.",
    },
  },
  async run({ $ }) {
    const {
      app,
      mediaId,
    } = this;

    const response = await app.getTranscript({
      $,
      mediaId,
    });

    $.export("$summary", `Successfully retrieved transcription for media ID \`${response.data.mediaId}\`.`);
    return response.data.insight.transcript;
  },
};
