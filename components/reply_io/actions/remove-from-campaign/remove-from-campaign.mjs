import reply from "../../reply_io.app.mjs";

export default {
  key: "reply_io-remove-from-campaign",
  name: "Remove Contact From Campaign",
  description: "Remove an existing contact from the selected campaign. [See the docs here](https://apidocs.reply.io/#502be5e9-0f1e-47bc-a45f-e5845f298610)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reply,
    campaignId: {
      propDefinition: [
        reply,
        "campaignId",
      ],
    },
    contactEmail: {
      propDefinition: [
        reply,
        "contactEmail",
        (c) => ({
          campaignId: c.campaignId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      campaignId: this.campaignId,
      email: this.contactEmail,
    };
    await this.reply.removeFromCampaign({
      data,
      $,
    });
    $.export("$summary", `Successfully removed contact ${this.contactEmail} from campaign with ID ${this.campaignId}.`);
    // nothing to return;
  },
};
