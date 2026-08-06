import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-find-media",
  name: "Find Media",
  description: "Find a media file in Speak AI by its ID, and return the analysis stored against it. [See the documentation](https://docs.speakai.co/api/media/#get-media-insight-media-id).",
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
      description: "Look the media file up on behalf of another user in the account. Enterprise accounts only; ignored otherwise",
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
