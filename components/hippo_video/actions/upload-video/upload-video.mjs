import { ConfigurationError } from "@pipedream/platform";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-upload-video",
  name: "Upload Video",
  description: "Uploads a video from a given URL. [See the documentation](https://help.hippovideo.io/support/solutions/articles/19000100703-import-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hippoVideo,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the video.",
    },
    url: {
      type: "string",
      label: "Video URL",
      description: "Public URL of the videos to be downloaded and uploaded to HippoVideo.",
    },
  },
  async run({ $ }) {
    const response = await this.hippoVideo.uploadVideo({
      $,
      data: {
        title: this.title,
        url: this.url,
      },
    });

    if (response.code != "200") throw new ConfigurationError(response.message);

    $.export("$summary", `Video uploaded successfully with Id: ${response.video_id}`);
    return response;
  },
};
