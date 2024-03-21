import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-delete-video",
  name: "Delete Video",
  description: "Permanently deletes a video from the user's Vimeo account. This action can't be undone.",
  version: "0.0.1",
  type: "action",
  props: {
    vimeo,
    videoId: vimeo.propDefinitions.videoId,
  },
  async run({ $ }) {
    const response = await this.vimeo.deleteVideo(this.videoId);
    $.export("$summary", `Successfully deleted video with ID: ${this.videoId}`);
    return response;
  },
};
