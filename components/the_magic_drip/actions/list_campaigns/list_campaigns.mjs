import the_magic_drip from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-list-campaigns",
  name: "List Campaigns",
  description: "Lists all available campaigns. [See the documentation](https://docs.themagicdrip.com/api-reference/introduction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    the_magic_drip,
  },
  async run({ $ }) {
    const response = await this.the_magic_drip.listCampaigns();
    $.export("$summary", `Listed ${response.campaigns.length} campaigns`);
    return response.campaigns;
  },
};
