import zoho_subscriptions from "../../zoho_subscriptions.app.mjs";

export default {
  key: "zoho_subscriptions-list-organization-id-options",
  name: "List Organization Id Options",
  description: "Retrieves available options for the Organization Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_subscriptions,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zoho_subscriptions.propDefinitions.organizationId.options
      .call(this.zoho_subscriptions, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
