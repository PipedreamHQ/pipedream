import spotlightr from "../../spotlightr.app.mjs";

export default {
  key: "spotlightr-list-video-group-options",
  name: "List Video Group Options",
  description: "Retrieves available options for the Video Group field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spotlightr,
  },
  async run({ $ }) {
    const options = await spotlightr.propDefinitions.videoGroup.options.call(this.spotlightr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
