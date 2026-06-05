import browse_ai from "../../browse_ai.app.mjs";

export default {
  key: "browse_ai-list-robot-id-options",
  name: "List Robot ID Options",
  description: "Retrieves available options for the Robot ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    browse_ai,
  },
  async run({ $ }) {
    const options = await browse_ai.propDefinitions.robotId.options.call(this.browse_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
