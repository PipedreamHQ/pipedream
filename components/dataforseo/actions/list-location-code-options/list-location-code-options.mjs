import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-list-location-code-options",
  name: "List Location Code Options",
  description: "Retrieves available options for the Location Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataforseo,
  },
  async run({ $ }) {
    const options = await dataforseo.propDefinitions.locationCode.options.call(this.dataforseo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
