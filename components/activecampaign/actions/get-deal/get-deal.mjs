import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-get-deal",
  name: "Get Deal",
  description: "Retrieves an existing deal. See the docs [here](https://developers.activecampaign.com/reference/retrieve-a-deal)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    activecampaign,
    dealId: {
      type: "string",
      description: "ID of the deal to retrieve.",
      propDefinition: [
        activecampaign,
        "deals",
      ],
    },
  },
  async run({ $ }) {
    const { dealId } = this;

    const response = await this.activecampaign.getDeal({
      dealId,
    });

    $.export("$summary", `Successfully found deal with ID ${response.deal.id}`);

    return response;
  },
};
