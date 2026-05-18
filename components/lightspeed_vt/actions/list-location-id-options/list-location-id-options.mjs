import lightspeed_vt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-list-location-id-options",
  name: "List Location Id Options",
  description: "Retrieves available options for the Location Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lightspeed_vt,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await lightspeed_vt.propDefinitions.locationId.options
      .call(this.lightspeed_vt, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
