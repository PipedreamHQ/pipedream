import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-find-media",
  name: "Find Media",
  description: "Look up a single Speak AI media file by its ID and return everything stored against it: transcript, sentiment, keywords, topics and metadata. Use **Get Transcription** instead when only the transcript is needed. [See the documentation](https://docs.speakai.co/api/media/#get-media-insight-media-id).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    mediaId: {
      propDefinition: [
        app,
        "mediaId",
      ],
      description: "The media file to look up",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "A Speak AI user ID, e.g. `6a708504253783a639e51914`, returned as `userId` on any media record. Looks the media file up on behalf of that user. Enterprise accounts only; ignored otherwise",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      mediaId,
      userId,
    } = this;

    const response = await app.getInsight({
      $,
      mediaId,
      params: {
        userId,
      },
    });

    $.export("$summary", `Successfully found media \`${response.data.mediaId}\``);
    return response;
  },
};
