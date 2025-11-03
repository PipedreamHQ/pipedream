import blotato from "../../blotato.app.mjs";

export default {
  key: "blotato-delete-video",
  name: "Delete Video",
  description: "Delete a video, carousel, or graphic. [See documentation](https://help.blotato.com/api/api-reference/delete-video)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    blotato,
    videoId: {
      type: "string",
      label: "Video ID",
      description: "The ID of the video to delete",
    },
  },
  async run({ $ }) {
    const { videoId } = this;

    const response = await this.blotato.deleteVideo({
      $,
      videoId,
    });

    $.export("$summary", `Successfully deleted video with ID: ${videoId}`);

    return response;
  },
};
