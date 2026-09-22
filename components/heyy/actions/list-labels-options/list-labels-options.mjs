import heyy from "../../heyy.app.mjs";

export default {
  key: "heyy-list-labels-options",
  name: "List Labels Options",
  description: "Retrieves available options for the Labels field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heyy,
  },
  async run({ $ }) {
    const options = await heyy.propDefinitions.labels.options.call(this.heyy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
