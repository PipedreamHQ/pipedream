import zoho_campaigns from "../../zoho_campaigns.app.mjs";

export default {
  key: "zoho_campaigns-list-mailing-list-options",
  name: "List Mailing List Options",
  description: "Retrieves available options for the Mailing List field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_campaigns,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zoho_campaigns.propDefinitions.mailingList.options
      .call(this.zoho_campaigns, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
