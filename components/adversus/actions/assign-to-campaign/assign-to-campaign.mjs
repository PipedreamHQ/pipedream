import adversus from "../../adversus.app.mjs";

export default {
  key: "adversus-assign-to-campaign",
  name: "Assign Lead to Campaign",
  description: "Assign a lead to a campaign in Adversus. [See the API documentation](https://solutions.adversus.io/api).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adversus,
    leadId: {
      propDefinition: [
        adversus,
        "leadId",
      ],
    },
    campaignId: {
      propDefinition: [
        adversus,
        "campaignId",
      ],
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include when assigning to campaign",
      optional: true,
    },
  },
  /**
   * Execute the action to assign a lead to a campaign
   * @param {Object} $ - Pipedream context
   * @returns {Promise} The response from assigning the lead to campaign
   */
  async run({ $ }) {
    const response = await this.adversus.assignLeadToCampaign(this.leadId, this.campaignId, {
      data: {
        ...(this.additionalFields || {}),
      },
    });

    $.export("$summary", `Successfully assigned lead ${this.leadId} to campaign ${this.campaignId}`);

    return response;
  },
};

