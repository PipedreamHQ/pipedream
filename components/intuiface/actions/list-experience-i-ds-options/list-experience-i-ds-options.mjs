import intuiface from "../../intuiface.app.mjs";

export default {
  key: "intuiface-list-experience-i-ds-options",
  name: "List Experience IDs Options",
  description: "Retrieves available options for the Experience IDs field.",
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
    const options = await intuiface.propDefinitions.experienceIDs.options.call(this.intuiface);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
