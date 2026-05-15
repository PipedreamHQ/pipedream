import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-list-event-type-options",
  name: "List Event Type Options",
  description: "Retrieves available options for the Event Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    activecampaign,
  },
  async run({ $ }) {
    const options = await activecampaign.propDefinitions.eventType.options
      .call(this.activecampaign);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
