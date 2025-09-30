import veedea from "../../veedea.app.mjs";

export default {
  key: "veedea-list-leads",
  name: "List Leads",
  description: "Get a list of leads in a campaign. [See the documentation](https://veedea.com/api/doc)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    veedea,
    campaignId: {
      propDefinition: [
        veedea,
        "campaignId",
      ],
    },
    maxResults: {
      propDefinition: [
        veedea,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const token = await this.veedea.getToken();
    const leads = await this.veedea.getPaginatedResources({
      fn: this.veedea.listLeads,
      args: {
        $,
        token,
        params: {
          campaign_id: this.campaignId,
        },
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${leads.length} leads`);
    return leads;
  },
};
