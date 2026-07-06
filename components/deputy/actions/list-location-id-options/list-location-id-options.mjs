import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-list-location-id-options",
  name: "List Location ID Options",
  description: "Retrieves available options for the Location ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    deputy,
  },
  async run({ $ }) {
    const options = await deputy.propDefinitions.locationId.options.call(this.deputy, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
