import launch27 from "../../launch27.app.mjs";

export default {
  key: "launch27-list-frequency-id-options",
  name: "List Frequency ID Options",
  description: "Retrieves available options for the Frequency ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    launch27,
  },
  async run({ $ }) {
    const options = await launch27.propDefinitions.frequencyId.options.call(this.launch27);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
