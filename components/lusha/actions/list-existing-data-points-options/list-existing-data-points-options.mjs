import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-existing-data-points-options",
  name: "List Existing Data Points Options",
  description: "Retrieves available options for the Existing Data Points field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lusha,
  },
  async run({ $ }) {
    const options = await lusha.propDefinitions.existingDataPoints.options.call(this.lusha);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
