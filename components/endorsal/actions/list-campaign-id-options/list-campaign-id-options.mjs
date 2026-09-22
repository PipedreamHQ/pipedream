import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-list-campaign-id-options",
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
    endorsal,
  },
  async run({ $ }) {
    const options = await endorsal.propDefinitions.campaignID.options.call(this.endorsal);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
