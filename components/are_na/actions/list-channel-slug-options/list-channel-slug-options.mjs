import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-list-channel-slug-options",
  name: "List Channel Slug Options",
  description: "Retrieves available options for the Channel Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    are_na,
  },
  async run({ $ }) {
    const options = await are_na.propDefinitions.channelSlug.options.call(this.are_na);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
