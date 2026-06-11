import intuiface from "../../intuiface.app.mjs";

export default {
  key: "intuiface-list-experience-names-options",
  name: "List Experience Names Options",
  description: "Retrieves available options for the Experience Names field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intuiface,
  },
  async run({ $ }) {
    const options = await intuiface.propDefinitions.experienceNames.options
      .call(this.intuiface);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
