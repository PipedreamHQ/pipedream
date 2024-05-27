import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-send-personalization-request",
  name: "Send Personalization Request",
  description: "Sends a personalization request for a specified video. [See the documentation](https://help.hippovideo.io/support/solutions/articles/19000099793-bulk-video-personalization-and-tracking-api)",
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
    file: {
      type: "string",
      label: "File",
      description: "csv, xls, and xlsx file saved to the [`/tmp` directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory). To get file schema, [see documentation](https://help.hippovideo.io/support/solutions/articles/19000099793-bulk-video-personalization-and-tracking-api)",
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const file = fs.createReadStream(checkTmp(this.file));

    formData.append("file", file);
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
