import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import constants from "../../common/constants.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  key: "gorgias_oauth-create-ticket-message",
  name: "Create Ticket Message",
  description: "Create a message for a ticket in the Gorgias system. [See the documentation](https://developers.gorgias.com/reference/create-ticket-message)",
  version: "0.0.1",
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
    channel: {
      propDefinition: [
        gorgiasOauth,
        "channel",
      ],
    },
    fromAddress: {
      propDefinition: [
        gorgiasOauth,
        "address",
      ],
      label: "From Address",
    },
    toAddress: {
      propDefinition: [
        gorgiasOauth,
        "address",
      ],
      label: "To Address",
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
    fromAgent: {
      type: "boolean",
      label: "From Agent",
      description: "Whether the message was sent by your company to a customer, or the opposite",
      default: false,
      optional: true,
    },
    sentDatetime: {
      type: "string",
      label: "Sent Datetime",
      description: "When the message was sent. If ommited, the message will be sent by Gorgias. E.g. `2025-01-27T19:38:52.028Z`",
      optional: true,
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "Describes more detailed channel information of how the message is sent/received",
      options: constants.sourceTypes,
      optional: true,
    },
  },
  methods: {
    createMessage({
      ticketId, ...opts
    }) {
      return this.gorgiasOauth._makeRequest({
        method: "POST",
        path: `/tickets/${ticketId}/messages`,
        ...opts,
      });
    },
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

    const response = await this.createMessage({
      $,
      ticketId: this.ticketId,
      data: {
        channel: this.channel,
        source: {
          type: this.sourceType,
          from: {
            address: this.fromAddress,
          },
          to: [
            {
              address: this.toAddress,
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
      },
    });

    $.export("$summary", `Succesfully created ticket message with ID: ${response.id}`);

    return response;
  },
};
