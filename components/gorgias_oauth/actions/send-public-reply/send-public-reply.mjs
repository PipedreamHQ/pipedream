import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "gorgias_oauth-send-public-reply",
  name: "Send Public Reply",
  description: "Post a customer-facing reply to a ticket on behalf of an agent. [See the documentation](https://developers.gorgias.com/reference/create-ticket-message)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    gorgiasOauth,
    ticketId: {
      propDefinition: [
        gorgiasOauth,
        "ticketId",
      ],
    },
    fromUser: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      label: "From Agent",
      description: "The agent sending the reply",
      optional: false,
    },
    toCustomer: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
      label: "To Customer",
      description: "The customer receiving the reply",
      optional: false,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Body of the reply. Accepts HTML",
    },
    bodyText: {
      propDefinition: [
        gorgiasOauth,
        "bodyText",
      ],
    },
    channel: {
      propDefinition: [
        gorgiasOauth,
        "channel",
      ],
      options: constants.channels.filter((c) => c !== "internal-note"),
      optional: false,
      default: "email",
    },
    via: {
      propDefinition: [
        gorgiasOauth,
        "via",
      ],
      optional: false,
    },
    integrationId: {
      propDefinition: [
        gorgiasOauth,
        "integrationId",
      ],
    },
    subject: {
      propDefinition: [
        gorgiasOauth,
        "subject",
      ],
      optional: true,
    },
    fromAddress: {
      type: "string",
      label: "From Address (override)",
      description: "If set, used as `source.from.address` instead of looking up the From Agent's email. Useful for shared inboxes (e.g. `support@example.com`).",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name (override)",
      description: "Optional display name for `source.from`.",
      optional: true,
    },
    toAddress: {
      type: "string",
      label: "To Address (override)",
      description: "If set, used as `source.to[0].address`. Otherwise, messaging channels (chat, Instagram DM, Messenger, WhatsApp, SMS, Twitter DM) use the address of the customer's latest message on that channel in the ticket (e.g. a chat session id), and other channels use the To Customer's email.",
      optional: true,
    },
    toName: {
      type: "string",
      label: "To Name (override)",
      description: "Optional display name for `source.to[0]`.",
      optional: true,
    },
    attachmentUrl: {
      type: "string",
      label: "Attachment URL",
      description: "URL of the file to attach",
      optional: true,
    },
    attachmentName: {
      type: "string",
      label: "Attachment File Name",
      description: "File name for the attachment. Required when Attachment URL is set",
      optional: true,
    },
    sentDatetime: {
      type: "string",
      label: "Sent Datetime",
      description: "When the message was sent. If omitted, Gorgias sets it automatically. E.g. `2025-01-27T19:38:52.028Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.channel === "internal-note") {
      throw new ConfigurationError("\"internal-note\" is not a valid channel for Send Public Reply. Use the Send Internal Note action instead.");
    }

    if ((this.attachmentUrl && !this.attachmentName)
      || (!this.attachmentUrl && this.attachmentName)
    ) {
      throw new ConfigurationError("Both Attachment URL and Attachment File Name are required when attaching a file");
    }

    let contentType, size;
    if (this.attachmentUrl) {
      ({
        contentType, size,
      } = await this.gorgiasOauth.getAttachmentInfo($, this.attachmentUrl));
    }

    const fromAddress = this.fromAddress
      ?? (await this.gorgiasOauth.retrieveUser({
        $,
        id: this.fromUser,
      })).email;

    const toAddress = this.toAddress
      ?? await this.gorgiasOauth.getCustomerChannelAddress({
        $,
        ticketId: this.ticketId,
        channel: this.channel,
      })
      ?? (await this.gorgiasOauth.retrieveCustomer({
        $,
        id: this.toCustomer,
      })).email;

    if (!toAddress && constants.MESSAGING_CHANNELS.includes(this.channel)) {
      throw new ConfigurationError(`No ${this.channel} address found for the customer on this ticket. Set To Address`);
    }

    const response = await this.gorgiasOauth.createMessage({
      $,
      ticketId: this.ticketId,
      data: {
        channel: this.channel,
        via: this.via,
        from_agent: true,
        body_html: this.message,
        body_text: this.bodyText,
        integration_id: this.integrationId,
        subject: this.subject,
        sent_datetime: this.sentDatetime,
        sender: {
          id: this.fromUser,
        },
        receiver: {
          id: this.toCustomer,
        },
        source: {
          from: {
            address: fromAddress,
            ...(this.fromName && {
              name: this.fromName,
            }),
          },
          to: [
            {
              address: toAddress,
              ...(this.toName && {
                name: this.toName,
              }),
            },
          ],
        },
        attachments: this.attachmentUrl && [
          {
            url: this.attachmentUrl,
            name: this.attachmentName,
            content_type: contentType,
            size,
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent public reply with ID: ${response.id}`);
    return response;
  },
};
