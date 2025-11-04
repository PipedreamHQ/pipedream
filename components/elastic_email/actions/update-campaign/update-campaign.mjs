import app from "../../elastic_email.app.mjs";
import { isValidEmailFormat } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "elastic_email-update-campaign",
  name: "Update Campaign",
  description: "Update a campaign in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/campaignsByNamePut)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    campaign: {
      propDefinition: [
        app,
        "campaign",
      ],
    },
    name: {
      type: "string",
      label: "Campaign Name",
      description: "The name of the campaign",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Your e-mail with an optional name (e.g.: `email@domain.com` or `John Doe <email@domain.com>`)",
      optional: true,
    },
    recipientListNames: {
      propDefinition: [
        app,
        "listNames",
      ],
      label: "Recipient List Names",
      description: "Names of lists from your Account to read recipients from",
    },
    recipientSegmentNames: {
      propDefinition: [
        app,
        "segmentNames",
      ],
      label: "Recipient Segment Names",
      description: "Names of segments from your Account to read recipients from",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "To what address should the recipients reply to (e.g. `email@domain.com` or `John Doe <email@domain.com>`)",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Default subject of email",
      optional: true,
    },
    templateName: {
      propDefinition: [
        app,
        "templateName",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        app,
        "campaignStatus",
      ],
      optional: true,
    },
    excludeRecipientListNames: {
      propDefinition: [
        app,
        "listNames",
      ],
      label: "Exclude Recipient List Names",
      description: "Names of lists from your Account to exclude from the campaign",
    },
    excludeRecipientSegmentNames: {
      propDefinition: [
        app,
        "segmentNames",
      ],
      label: "Exclude Recipient Segment Names",
      description: "Names of segments from your Account to exclude from the campaign",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.from && !isValidEmailFormat(this.from)) {
      throw new ConfigurationError("Invalid email format for 'From'");
    }
    if (this.replyTo && !isValidEmailFormat(this.replyTo)) {
      throw new ConfigurationError("Invalid email format for 'Reply To'");
    }

    const campaign = await this.app.getCampaign({
      $,
      campaign: this.campaign,
    });

    const response = await this.app.updateCampaign({
      $,
      campaign: this.campaign,
      data: {
        Name: this.name || campaign.Name,
        Recipients: {
          ListNames: this.recipientListNames || campaign.Recipients.ListNames || undefined,
          SegmentNames: this.recipientSegmentNames || campaign.Recipients.SegmentNames || undefined,
        },
        Content: [
          {
            From: this.from || campaign.Content[0].From,
            ReplyTo: this.replyTo || campaign.Content[0].ReplyTo,
            Subject: this.subject || campaign.Content[0].Subject,
            TemplateName: this.templateName || campaign.Content[0].TemplateName,
          },
        ],
        Status: this.status || campaign.Status,
        ExcludeRecipients: this.excludeRecipientListNames || this.excludeRecipientSegmentNames
          ? {
            ListNames: this.excludeRecipientListNames
              || campaign.ExcludeRecipients.ListNames
              || undefined,
            SegmentNames: this.excludeRecipientSegmentNames
              || campaign.ExcludeRecipients.SegmentNames
              || undefined,
          }
          : undefined,
      },
    });
    $.export("$summary", "Campaign updated successfully");
    return response;
  },
};
