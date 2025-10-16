import app from "../../getresponse.app.mjs";

export default {
  key: "getresponse-find-campaign-list",
  name: "Find Campaign List",
  description: "Finds a campaign list by filters. [See the docs here](https://apireference.getresponse.com/?_ga=2.250017859.499257728.1666974700-2116668472.1666974700&amp;_gl=1*8rz7cc*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3OTc1Mi42MC4wLjA.#operation/getCampaignList)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
  },
  async run({ $: step }) {
    const campaign = await this.app.getCampaign({
      step,
      campaignId: this.campaignId,
    });

    step.export("$summary", `Campaign with ID ${campaign.campaignId} has been found.`);

    return campaign;
  },
};
