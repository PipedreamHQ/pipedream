import faraday from "../../faraday.app.mjs";

export default {
  key: "faraday-list-target-id-options",
  name: "List Target ID Options",
  description: "Retrieves available options for the Target ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    faraday,
  },
  async run({ $ }) {
    const options = await faraday.propDefinitions.targetId.options.call(this.faraday);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
