import instantly from "../../instantly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "instantly-update-lead-status",
  name: "Update Lead Status",
  description: "Updates the status of a lead in a campaign. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    instantly,
    email: {
      propDefinition: [
        instantly,
        "email",
      ],
    },
    newStatus: {
      propDefinition: [
        instantly,
        "newStatus",
      ],
    },
    campaignId: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.instantly.updateLeadStatus({
      email: this.email,
      newStatus: this.newStatus,
      campaignId: this.campaignId,
    });
    $.export("$summary", `Updated status of lead with email ${this.email} to ${this.newStatus}`);
    return response;
  },
};
