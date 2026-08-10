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
      description: "A Speak AI media ID, for example `b4994aa1267c`. Get it from the `mediaId` field returned by Speak AI.",
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

    const foundId = response?.data?.mediaId;
    $.export("$summary", foundId
      ? `Successfully found media \`${foundId}\``
      : "Successfully found media");
    return response;
  },
};
