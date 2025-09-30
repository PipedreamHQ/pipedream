import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-send-personalization-request",
  name: "Send Personalization Request",
  description: "Sends a personalization request for a specified video. [See the documentation](https://help.hippovideo.io/support/solutions/articles/19000099793-bulk-video-personalization-and-tracking-api)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hippoVideo,
    videoId: {
      propDefinition: [
        hippoVideo,
        "videoId",
      ],
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide a file URL or a path to a file (csv, xls, or xlsx) in the `/tmp` directory.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    formData.append("file", stream, {
      filename: metadata.name,
    });
    formData.append("video_id", this.videoId);

    const response = await this.hippoVideo.personalizeVideo({
      $,
      data: formData,
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    });

    if (response.code != 200) throw new ConfigurationError(response.message || response.type);

    $.export("$summary", `Successfully sent personalization request for video Id: ${this.videoId}`);
    return response;
  },
};
