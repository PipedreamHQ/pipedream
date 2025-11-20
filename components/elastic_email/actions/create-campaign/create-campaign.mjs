import app from "../../elastic_email.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { isValidEmailFormat } from "../../common/utils.mjs";

export default {
  key: "elastic_email-create-campaign",
  name: "Create Campaign",
  description: "Create a campaign in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/campaignsPost)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "The name of the campaign",
    },
    from: {
      type: "string",
      label: "From",
      description: "Your e-mail with an optional name (e.g.: `email@domain.com` or `John Doe <email@domain.com>`)",
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
    },
    status: {
      propDefinition: [
        app,
        "campaignStatus",
      ],
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

    if (!this.recipientListNames && !this.recipientSegmentNames) {
      throw new ConfigurationError("You must provide at least one list or segment to read recipients from");
    }

    const response = await this.app.createCampaign({
      $,
      data: {
        Name: this.name,
        Recipients: {
          ListNames: this.recipientListNames,
          SegmentNames: this.recipientSegmentNames,
        },
        Content: [
          {
            From: this.from,
            ReplyTo: this.replyTo,
            Subject: this.subject,
            TemplateName: this.templateName,
          },
        ],
        Status: this.status,
        ExcludeRecipients: this.excludeRecipientListNames || this.excludeRecipientSegmentNames
          ? {
            ListNames: this.excludeRecipientListNames,
            SegmentNames: this.excludeRecipientSegmentNames,
          }
          : undefined,
      },
    });
    $.export("$summary", "Campaign created successfully");
    return response;
  },
};
