import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-delete-video",
  name: "Delete Video",
  description: "Permanently deletes a video from the user's Vimeo account. This action can't be undone. [See the documentation](https://developer.vimeo.com/api/reference/videos#delete_video)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vimeo,
    videoId: {
      propDefinition: [
        vimeo,
        "videoId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vimeo.deleteVideo({
      $,
      videoId: this.videoId,
    });
    $.export("$summary", `Successfully deleted video with ID: ${this.videoId}`);
    return response;
  },
};
