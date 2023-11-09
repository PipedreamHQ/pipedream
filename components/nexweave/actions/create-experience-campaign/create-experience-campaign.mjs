import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-create-experience-campaign",
  name: "Create Campaign Experience",
  description: "Generates a campaign experience based on a selected campaign. [See the documentation](https://documentation.nexweave.com/nexweave-api)",
  version: "0.0.1",
  type: "action",
  props: {
    nexweave,
    campaignId: {
      propDefinition: [
        nexweave,
        "campaignId",
      ],
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "The variables that you want to modify in the campaign.",
      async options({ campaignId }) {
        if (!campaignId) {
          return [];
        }
        const campaignDetails = await this.nexweave.getCampaignDetails(campaignId);
        return campaignDetails.result.variables.map((variable) => ({
          label: variable.key,
          value: variable.key,
        }));
      },
    },
  },
  async run({ $ }) {
    const data = this.variables.reduce((acc, variable) => {
      acc[variable.key] = variable.value;
      return acc;
    }, {});

    const response = await this.nexweave.createCampaignExperience(this.campaignId, data);

    $.export("$summary", `Successfully created a campaign experience with ID: ${response.id}`);
    return response;
  },
};
