import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-list-campaign-id-options",
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
    sendloop,
  },
  async run({ $ }) {
    const options = await sendloop.propDefinitions.campaignId.options.call(this.sendloop);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
