import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gorgias_oauth-send-internal-note",
  name: "Send Internal Note",
  description: "Post an internal note to a ticket on behalf of an agent. [See the documentation](https://developers.gorgias.com/reference/create-ticket-message)",
  version: "0.0.2",
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
    },
    fromUser: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      label: "From Agent",
      description: "The agent posting the internal note",
      optional: false,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Body of the internal note. Accepts HTML",
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

    const response = await this.gorgiasOauth.createMessage({
      $,
      ticketId: this.ticketId,
      data: {
        channel: "internal-note",
        from_agent: true,
        body_html: this.message,
        sent_datetime: this.sentDatetime,
        sender: {
          id: this.fromUser,
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

    $.export("$summary", `Successfully created internal note with ID: ${response.id}`);
    return response;
  },
};
