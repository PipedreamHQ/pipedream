import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-list-video-template-id-options",
  name: "List Video Template ID Options",
  description: "Retrieves available options for the Video Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nexweave,
  },
  async run({ $ }) {
    const options = await nexweave.propDefinitions.videoTemplateId.options.call(this.nexweave);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
