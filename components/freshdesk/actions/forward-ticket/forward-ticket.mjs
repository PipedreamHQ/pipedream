import { parseObject } from "../../common/utils.mjs";
import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-forward-ticket",
  name: "Forward Ticket",
  description: "Forward a ticket to an external email address. [See the documentation](https://developers.freshdesk.com/api/#forward_a_ticket).",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the forward in HTML format",
    },
    toEmails: {
      type: "string[]",
      label: "To Emails",
      description: "Email addresses to forward the ticket to",
    },
    ccEmails: {
      type: "string[]",
      label: "CC Emails",
      description: "Email addresses to CC on the forward",
      optional: true,
    },
    bccEmails: {
      type: "string[]",
      label: "BCC Emails",
      description: "Email addresses to BCC on the forward",
      optional: true,
    },
    fromEmail: {
      propDefinition: [
        freshdesk,
        "fromEmail",
      ],
      description: "Email address from which the forward is sent. By default, the global support email will be used.",
      optional: true,
    },
    includeQuotedText: {
      type: "boolean",
      label: "Include Quoted Text",
      description: "Whether to include quoted text from previous conversations",
      default: true,
      optional: true,
    },
    includeOriginalAttachments: {
      type: "boolean",
      label: "Include Original Attachments",
      description: "Whether to include the original ticket attachments",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      body: this.body,
      to_emails: parseObject(this.toEmails),
      cc_emails: parseObject(this.ccEmails),
      bcc_emails: parseObject(this.bccEmails),
      from_email: this.fromEmail?.label,
      include_quoted_text: this.includeQuotedText,
      include_original_attachments: this.includeOriginalAttachments,
    };

    const response = await this.freshdesk.forwardTicket({
      $,
      ticketId: this.ticketId,
      data,
    });

    $.export("$summary", `Ticket ${this.ticketId} forwarded successfully`);
    return response;
  },
};
