import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-list-handle-options",
  name: "List Handle Options",
  description: "Retrieves available options for the Handle field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gigasheet,
  },
  async run({ $ }) {
    const options = await gigasheet.propDefinitions.handle.options.call(this.gigasheet);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
