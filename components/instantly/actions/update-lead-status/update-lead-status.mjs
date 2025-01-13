import { ConfigurationError } from "@pipedream/platform";
import instantly from "../../instantly.app.mjs";

export default {
  key: "instantly-update-lead-status",
  name: "Update Lead Status",
  description: "Updates the status of a lead in a campaign. [See the documentation](https://developer.instantly.ai/lead/update-lead-status)",
  version: "0.0.1",
  type: "action",
  props: {
    instantly,
    campaignId: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
    },
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
  },
  async run({ $ }) {
    try {
      const response = await this.instantly.updateLeadStatus({
        $,
        data: {
          email: this.email,
          new_status: this.newStatus,
          campaign_id: this.campaignId,
        },
      });
      $.export("$summary", `Updated lead ${this.email} to status '${this.newStatus}'`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.error);
    }
  },
};
