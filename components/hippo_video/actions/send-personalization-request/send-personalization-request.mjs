import hippoVideo from "../../hippo_video.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hippo_video-send-personalization-request",
  name: "Send Personalization Request",
  description: "Sends a personalization request for a specified video.",
  version: "0.0.1",
  type: "action",
  props: {
    hippoVideo,
    videoId: {
      propDefinition: [
        hippoVideo,
        "videoId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hippoVideo.personalizeVideo({
      videoId: this.videoId,
    });
    $.export("$summary", `Successfully sent personalization request for video ID: ${this.videoId}`);
    return response;
  },
};
