import devin from "../../devin.app.mjs";

export default {
  key: "devin-list-secret-ids-options",
  name: "List Secret IDs Options",
  description: "Retrieves available options for the Secret IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    devin,
  },
  async run({ $ }) {
    const options = await devin.propDefinitions.secretIds.options.call(this.devin);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
