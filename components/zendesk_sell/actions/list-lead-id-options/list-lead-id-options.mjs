import zendesk_sell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-list-lead-id-options",
  name: "List Lead ID Options",
  description: "Retrieves available options for the Lead ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk_sell,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zendesk_sell.propDefinitions.leadId.options.call(this.zendesk_sell, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
