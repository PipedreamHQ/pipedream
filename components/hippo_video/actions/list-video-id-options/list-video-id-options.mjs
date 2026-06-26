import hippo_video from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-list-video-id-options",
  name: "List Video ID Options",
  description: "Retrieves available options for the Video ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hippo_video,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await hippo_video.propDefinitions.videoId.options.call(this.hippo_video, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
