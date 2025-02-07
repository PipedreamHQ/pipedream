import salespype from "../../salespype.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salespype-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: "Adds a contact to a campaign. [See the documentation]()",
  version: "0.0.{{ts}}",
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
      campaignId: this.campaignId,
      contactId: this.contactId,
    });
    $.export("$summary", `Added contact ${this.contactId} to campaign ${this.campaignId}`);
    return response;
  },
};
