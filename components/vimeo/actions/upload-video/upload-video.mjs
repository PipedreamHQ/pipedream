import vimeo from "../../vimeo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vimeo-upload-video",
  name: "Upload Video",
  description: "Uploads a video to the user's Vimeo account. Ensure you have enough storage quota on your account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vimeo,
    videoFile: vimeo.propDefinitions.videoFile,
  },
  async run({ $ }) {
    const response = await this.vimeo.uploadVideo(this.videoFile);
    $.export("$summary", `Successfully uploaded video with ID: ${response.uri.split("/").pop()}`);
    return response;
  },
};
