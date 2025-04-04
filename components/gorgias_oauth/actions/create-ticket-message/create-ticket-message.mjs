import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  key: "gorgias_oauth-create-ticket-message",
  name: "Create Ticket Message",
  description: "Create a message for a ticket in the Gorgias system. [See the documentation](https://developers.gorgias.com/reference/create-ticket-message)",
  version: "0.0.2",
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
      description: "Whether the message was sent by your company to a customer, or the opposite",
      reloadProps: true,
    },
    fromUser: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      label: "From User",
      description: "User who sent the message",
      optional: false,
      hidden: true,
    },
    toUser: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      label: "To User",
      description: "The user receiving the message",
      optional: false,
      hidden: true,
    },
    fromCustomer: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
      label: "From Customer",
      description: "The customer who sent the message",
      hidden: true,
    },
    toCustomer: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
      label: "To Customer",
      description: "The customer receiving the message",
      hidden: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message of the ticket. Accepts HTML",
    },
    via: {
      propDefinition: [
        gorgiasOauth,
        "via",
      ],
      optional: false,
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
  additionalProps(props) {
    props.toUser.hidden = this.fromAgent;
    props.fromCustomer.hidden = this.fromAgent;
    props.toCustomer.hidden = !this.fromAgent;
    props.fromUser.hidden = !this.fromAgent;
    return {};
  },
  methods: {
    async getAttachmentInfo($, url) {
      const { headers } = await axios($, {
        method: "HEAD",
        url,
        returnFullResponse: true,
      });
      return {
        contentType: headers["content-type"],
        size: headers["content-length"],
      };
    },
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

    let contentType, size;
    if (this.attachmentUrl) {
      ({
        contentType, size,
      } = await this.getAttachmentInfo($, this.attachmentUrl));
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
    if (!toId) {
      throw new ConfigurationError(`"${this.fromAgent
        ? "To Customer"
        : "To User"}" is required when "From Agent" is set to \`${this.fromAgent}\``);
    }

    const response = await this.gorgiasOauth.createMessage({
      $,
      ticketId: this.ticketId,
      data: {
        channel: "email",
        source: {
          from: {
            address: await this.getEmail($, fromId, "from"),
          },
          to: [
            {
              address: await this.getEmail($, toId, "to"),
            },
          ],
        },
        body_html: this.message,
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
        receiver: {
          id: toId,
        },
      },
    });

    $.export("$summary", `Succesfully created ticket message with ID: ${response.id}`);

    return response;
  },
};
