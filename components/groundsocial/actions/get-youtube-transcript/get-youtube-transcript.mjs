import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-get-youtube-transcript",
  name: "Get YouTube Transcript",
  description: "Get the transcript of a YouTube video. [See the documentation](https://groundsocial.dev/docs/api/youtube-video-transcript)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    videoId: {
      type: "string",
      label: "Video ID or URL",
      description: "The video ID (e.g. `dQw4w9WgXcQ`) or its URL. The **Search YouTube Videos** action returns IDs in `items[].id.videoId`",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code such as `en`. Defaults to the video's original language.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.callEndpoint({
      $,
      endpointId: "youtube.video.transcript",
      params: {
        id: this.videoId,
        language: this.language,
      },
    });
    $.export("$summary", `Successfully retrieved the transcript of ${this.videoId}`);
    return response;
  },
};
