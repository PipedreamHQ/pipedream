import salespype from "../../salespype.app.mjs";

export default {
  key: "salespype-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: "Adds a contact to a campaign. [See the documentation](https://documenter.getpostman.com/view/5101444/2s93Y3u1Eb#4b2f8b3e-155d-4485-9a25-4f7d98d04b53)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salespype,
    campaignId: {
      propDefinition: [
        salespype,
        "campaignId",
      ],
    },
    contactId: {
      propDefinition: [
        salespype,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.salespype.addContactToCampaign({
      $,
      campaignId: this.campaignId,
      contactId: this.contactId,
    });
    $.export("$summary", `Added contact ${this.contactId} to campaign ${this.campaignId}`);
    return response;
  },
};
