import { ConfigurationError } from "@pipedream/platform";
import anymail from "../../anymail.app.mjs";

export default {
  key: "anymail-add-prospect-to-campaign",
  name: "Add Prospect to Campaign",
  description: "Adds an existing prospect to a campaign by email. The result says if it was enrolled, already there or suppressed. [See the docs](https://developers.anymail.watch/campaigns/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    anymail,
    campaignId: {
      propDefinition: [
        anymail,
        "campaignId",
      ],
    },
    email: {
      propDefinition: [
        anymail,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const { data: [
      row,
    ] } = await this.anymail.addProspectsToCampaign({
      $,
      campaignId: this.campaignId,
      data: {
        emails: [
          this.email,
        ],
      },
    });
    if (row.result === "not-found") {
      throw new ConfigurationError(`${this.email} is not a prospect in this workspace. Use "Create or Update Prospect" first.`);
    }
    $.export("$summary", `${this.email}: ${row.result}`);
    return {
      ...row,
      campaign_id: this.campaignId,
    };
  },
};
