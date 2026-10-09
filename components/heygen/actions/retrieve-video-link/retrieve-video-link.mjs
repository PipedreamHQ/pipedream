import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-retrieve-video-link",
  name: "Retrieve Video Link",
  description: "Fetches a link for a specific heygen video. The link is only available once the video status is `completed`. Works for any video ID, including videos created in the HeyGen web app. If you don't have the video ID, use the **List Videos** action first (note it may not list web-app videos). Example: Video ID `v_123` returns `{\"data\": {\"id\": \"v_123\", \"status\": \"completed\", \"video_url\": \"https://...\"}, \"video_link\": \"https://...\"}`; while the video is still processing, `video_link` is null and `data.status` is `processing`. [See the documentation](https://developers.heygen.com/reference/get-video)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
      videoId: this.videoId,
      $,
    });
    $.export("$summary", data.video_url
      ? `Successfully fetched video link: ${data.video_url}`
      : `Video is not ready (status: ${data.status})`);
    return {
      data,
      video_link: data.video_url,
    };
  },
};
