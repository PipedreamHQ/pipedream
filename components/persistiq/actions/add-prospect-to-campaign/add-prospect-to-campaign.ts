import { defineAction } from "@pipedream/types";
import app from "../../app/persistiq.app";

export default defineAction({
  key: "persistiq-add-prospect-to-campaign",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Add Prospect To Campaign",
  description: "Adds prospect to a campaign. [See docs here](https://apidocs.persistiq.com/#add-lead-to-a-campaign)",
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    leadId: {
      propDefinition: [
        app,
        "leadId",
      ],
    },
    mailboxId: {
      type: "string",
      label: "Mailbox ID",
      description: "An id of the mailbox to which the lead should be added.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addLeadToCampaign({
      $,
      campaignId: this.campaignId,
      data: {
        leads: this.leadId.map(( leadId: string ): { id:string; } => ({
          id: leadId,
        })),
        mailbox_id: this.mailboxId,
      },
    });
    $.export("$summary", `Successfully added Lead (ID(s): ${this.leadId.join(", ")}) to Campaign (ID: ${this.campaignId})`);
    return response;
  },
});
