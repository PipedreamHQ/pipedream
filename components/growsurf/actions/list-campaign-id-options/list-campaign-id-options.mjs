import growsurf from "../../growsurf.app.mjs";

export default {
  key: "growsurf-list-campaign-id-options",
  name: "List Campaign ID Options",
  description: "Retrieves available options for the Campaign ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    growsurf,
  },
  async run({ $ }) {
    const options = await growsurf.propDefinitions.campaignId.options.call(this.growsurf);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
