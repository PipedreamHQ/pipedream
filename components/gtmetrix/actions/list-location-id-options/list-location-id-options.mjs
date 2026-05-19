import gtmetrix from "../../gtmetrix.app.mjs";

export default {
  key: "gtmetrix-list-location-id-options",
  name: "List Location Options",
  description: "Retrieves available options for the Location field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gtmetrix,
  },
  async run({ $ }) {
    const options = await gtmetrix.propDefinitions.locationId.options.call(this.gtmetrix);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
