import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "gorgias_oauth-create-ticket-message",
  name: "Create Ticket Message",
  description: "Create a message or internal note on a Gorgias ticket. Use **List Tickets** to find the ticket ID and its customer, and **List Integrations** for the Integration ID. Set From Agent to `true` for a reply from your team (From User + To Customer) or `false` for a customer message (From Customer + To User). Returns the created message. [See the documentation](https://developers.gorgias.com/reference/create-ticket-message)",
  version: "0.4.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgiasOauth,
    ticketId: {
      propDefinition: [
        gorgiasOauth,
        "ticketId",
      ],
      description: "The ID of the ticket to add a message to",
    },
    fromAgent: {
      type: "boolean",
      label: "From Agent",
      description: "Whether the message was sent by your company to a customer, or the opposite. Must be `true` for internal notes. Example: `true`",
    },
    fromUser: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      label: "From User",
      description: "User who sent the message. Required when From Agent is `true`. Example: `123456`",
      optional: true,
    },
    toUser: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      label: "To User",
      description: "The user receiving the message. Required when From Agent is `false`. Example: `123456`",
      optional: true,
    },
    fromCustomer: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
      label: "From Customer",
      description: "The customer who sent the message. Required when From Agent is `false`. Example: `654321`",
      optional: true,
    },
    toCustomer: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
      label: "To Customer",
      description: "The customer receiving the message. Required when From Agent is `true`, except for internal notes. Example: `654321`",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message of the ticket. Accepts HTML",
    },
    bodyText: {
      propDefinition: [
        gorgiasOauth,
        "bodyText",
      ],
    },
    fromAddress: {
      type: "string",
      label: "From Address (override)",
      description: "If set, used as `source.from.address` instead of looking up the From User/Customer's email. Useful when sending on behalf of a shared inbox (e.g. `support@example.com`).",
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
      description: "If set, used as `source.to[0].address`. Otherwise, agent messages on messaging channels (chat, Instagram DM, Messenger, WhatsApp, SMS, Twitter DM) use the `source.from.address` of the To Customer's latest message on that channel in the ticket (see **List Ticket Messages**), e.g. `92fc13f6-55b5-4ff3-85c3-dbaaad7366fb` for chat, and everything else uses the To User/Customer's email.",
      optional: true,
    },
    toName: {
      type: "string",
      label: "To Name (override)",
      description: "Optional display name for `source.to[0]`.",
      optional: true,
    },
    channel: {
      propDefinition: [
        gorgiasOauth,
        "channel",
      ],
      optional: false,
      default: "email",
    },
    via: {
      propDefinition: [
        gorgiasOauth,
        "via",
      ],
      description: "How the message is sent from Gorgias. With `help-center`, Gorgias stores the message without sending it",
      optional: false,
      default: "api",
    },
    sourceType: {
      propDefinition: [
        gorgiasOauth,
        "sourceType",
      ],
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
    attachmentUrl: {
      type: "string",
      label: "Attachment URL",
      description: "The URL to access to the attached file",
      optional: true,
    },
    attachmentName: {
      type: "string",
      label: "Attachment File Name",
      description: "The name of the file to attach",
      optional: true,
    },
    sentDatetime: {
      type: "string",
      label: "Sent Datetime",
      description: "When the message was sent. If ommited, the message will be sent by Gorgias. E.g. `2025-01-27T19:38:52.028Z`",
      optional: true,
    },
  },
  methods: {
    /**
     * Get email address for user or customer
     * @param {object} $ - Step object
     * @param {string} id - User or customer ID
     * @param {string} type - Type of email to get (from/to)
     * @returns {string} Email address
     */
    async getEmail($, id, type = "from") {
      const {
        gorgiasOauth: {
          retrieveUser, retrieveCustomer,
        },
      } = this;
      const fn = this.fromAgent
        ? type === "from"
          ? retrieveUser
          : retrieveCustomer
        : type === "from"
          ? retrieveCustomer
          : retrieveUser;

      const { email } = await fn({
        $,
        id,
      });
      return email;
    },
  },
  async run({ $ }) {
    if ((this.attachmentUrl && !this.attachmentName)
      || (!this.attachmentUrl && this.attachmentName)
    ) {
      throw new ConfigurationError("Must enter both Attachment URL and Attachment File Name");
    }

    const isInternalNote = this.channel === "internal-note";

    if (isInternalNote && this.fromAgent === false) {
      throw new ConfigurationError("From Agent must be set to `true` when creating an internal note");
    }

    let contentType, size;
    if (this.attachmentUrl) {
      ({
        contentType, size,
      } = await this.gorgiasOauth.getAttachmentInfo($, this.attachmentUrl));
    }

    const fromId = this.fromAgent
      ? this.fromUser
      : this.fromCustomer;

    const toId = this.fromAgent
      ? this.toCustomer
      : this.toUser;

    if (!fromId) {
      throw new ConfigurationError(`"${this.fromAgent
        ? "From User"
        : "From Customer"}" is required when "From Agent" is set to \`${this.fromAgent}\``);
    }
    // For internal notes, we don't need to validation
    if (!isInternalNote) {
      if (!toId) {
        throw new ConfigurationError(`"${this.fromAgent
          ? "To Customer"
          : "To User"}" is required when "From Agent" is set to \`${this.fromAgent}\``);
      }
    }

    const messageData = {
      channel: this.channel,
      body_html: this.message,
      body_text: this.bodyText,
      via: this.via,
      subject: this.subject,
      from_agent: this.fromAgent,
      sent_datetime: this.sentDatetime,
      attachments: this.attachmentUrl && [
        {
          url: this.attachmentUrl,
          name: this.attachmentName,
          content_type: contentType,
          size,
        },
      ],
      sender: {
        id: fromId,
      },
    };

    // Only add source and receiver for non-internal notes
    if (!isInternalNote) {
      const useChannelAddress = this.fromAgent
        && constants.messagingChannels.includes(this.channel);
      const toAddress = this.toAddress ?? (useChannelAddress
        ? await this.gorgiasOauth.getCustomerChannelAddress({
          $,
          ticketId: this.ticketId,
          channel: this.channel,
          customerId: toId,
        })
        : await this.getEmail($, toId, "to"));
      if (!toAddress && useChannelAddress) {
        throw new ConfigurationError(`No ${this.channel} address found for the customer on this ticket. Set To Address`);
      }
      messageData.source = {
        ...(this.sourceType && {
          type: this.sourceType,
        }),
        from: {
          address: this.fromAddress ?? await this.getEmail($, fromId, "from"),
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
      };
      messageData.receiver = {
        id: toId,
      };
      messageData.integration_id = this.integrationId;
    }

    const response = await this.gorgiasOauth.createMessage({
      $,
      ticketId: this.ticketId,
      data: messageData,
    });

    $.export("$summary", `Successfully created ${isInternalNote
      ? "internal note"
      : "ticket message"} with ID: ${response.id}`);

    return response;
  },
};
