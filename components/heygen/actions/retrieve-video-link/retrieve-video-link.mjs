import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-retrieve-video-link",
  name: "Retrieve Video Link",
  description: "Fetches a link for a specific heygen video. [See the documentation](https://docs.heygen.com/reference/video-status)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    heygen,
    videoId: {
      propDefinition: [
        heygen,
        "videoId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.heygen.getVideo({
      params: {
        video_id: this.videoId,
      },
      $,
    });
    $.export("$summary", `Successfully fetched video link: ${data.video_url}`);
    return {
      data,
      video_link: data.video_url,
    };
  },
};
