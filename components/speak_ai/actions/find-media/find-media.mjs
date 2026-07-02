import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-find-media",
  name: "Find Media",
  description: "Find an existing Speak AI media item by its Media ID. [See the documentation](https://docs.speakai.co/).",
  version: "0.0.1",
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

    const results = await app.getInsights({
      $,
      params: {
        mediaId,
        pageSize: 1,
      },
    });
    const media = app.firstResult(results);

    $.export("$summary", media
      ? `Found media \`${mediaId}\`.`
      : `No media found for \`${mediaId}\`.`);
    return media;
  },
};
