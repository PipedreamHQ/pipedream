import veedea from "../../veedea.app.mjs";

export default {
  key: "veedea-list-campaigns",
  name: "List Campaigns",
  description: "Get the list of campaigns created in the Veedea Dashboard. [See the documentation](https://veedea.com/api/doc)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    veedea,
    maxResults: {
      propDefinition: [
        veedea,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const token = await this.veedea.getToken();
    const campaigns = await this.veedea.getPaginatedResources({
      fn: this.veedea.listCampaigns,
      args: {
        $,
        token,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${campaigns.length} campaigns`);
    return campaigns;
  },
};
