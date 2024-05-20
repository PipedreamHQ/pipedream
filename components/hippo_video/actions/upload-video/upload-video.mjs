import hippoVideo from "../../hippo_video.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hippo_video-upload-video",
  name: "Upload Video",
  description: "Uploads a video from a given URL. [See the documentation](https://api.hippovideo.io/v1/videos/upload)",
  version: "0.0.1",
  type: "action",
  props: {
    hippoVideo,
    videoUrl: {
      propDefinition: [
        hippoVideo,
        "videoUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hippoVideo.uploadVideo({
      videoUrl: this.videoUrl,
    });
    $.export("$summary", `Video uploaded successfully with URL: ${this.videoUrl}`);
    return response;
  },
};
