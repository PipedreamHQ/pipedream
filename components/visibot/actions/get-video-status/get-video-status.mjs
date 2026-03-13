import app from "../../visibot.app.mjs";

export default {
  key: "visibot-get-video-status",
  name: "Get Video Status",
  description: "Check the processing status of a video and retrieve the final URL when ready. [See the documentation](https://dashboard.visibot.app/api-docs#video-api-GETapi-video-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    videoId: {
      type: "string",
      label: "Video ID",
      description: "The ID of the video to check status for",
    },
  },
  async run({ $ }) {
    const {
      app,
      videoId,
    } = this;

    const response = await app.getVideoStatus({
      $,
      data: {
        video_id: videoId,
      },
    });
    $.export("$summary", `Video \`${videoId}\` status: \`${response.status}\``);
    return response;
  },
};
