import blotato from "../../blotato.app.mjs";

export default {
  key: "blotato-get-video",
  name: "Get Video",
  description: "Get a video, carousel, or graphic. [See documentation](https://help.blotato.com/api/api-reference/find-video)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    blotato,
    videoId: {
      type: "string",
      label: "Video ID",
      description: "The ID of the video to retrieve",
    },
  },
  async run({ $ }) {
    const { videoId } = this;

    const response = await this.blotato.getVideo({
      $,
      videoId,
    });

    $.export("$summary", `Successfully retrieved video with ID: ${videoId}`);

    return response;
  },
};
