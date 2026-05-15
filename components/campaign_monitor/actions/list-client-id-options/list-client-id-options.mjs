import campaign_monitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-list-client-id-options",
  name: "List Client ID Options",
  description: "Retrieves available options for the Client ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    campaign_monitor,
  },
  async run({ $ }) {
    const options = await campaign_monitor.propDefinitions.clientId.options
      .call(this.campaign_monitor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
