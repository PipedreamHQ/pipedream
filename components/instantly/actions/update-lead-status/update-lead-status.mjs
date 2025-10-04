import { ConfigurationError } from "@pipedream/platform";
import instantly from "../../instantly.app.mjs";

export default {
  key: "instantly-update-lead-status",
  name: "Update Lead Status",
  description: "Updates the interest status of a lead in a campaign. [See the documentation](https://developer.instantly.ai/api/v2/customtag/toggletagresource)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "leadIds",
        () => ({
          valueKey: "email",
        }),
      ],
      type: "string",
      label: "Lead Email",
      description: "Email address of the lead to update",
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
          lead_email: this.email,
          interest_value: this.newStatus,
          campaign_id: this.campaignId,
        },
      });
      $.export("$summary", `Updated status of lead: ${this.email}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.error);
    }
  },
};
