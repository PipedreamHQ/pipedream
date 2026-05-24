import jibble from "../../jibble.app.mjs";

export default {
  key: "jibble-list-location-id-options",
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
    jibble,
  },
  async run({ $ }) {
    const options = await jibble.propDefinitions.locationId.options.call(this.jibble);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
