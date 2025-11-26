import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import { parseObject } from "../../common/utils.mjs";
import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-reply",
  name: "Create a Reply",
  description: "Create a reply to a ticket. [See the documentation](https://developers.freshdesk.com/api/#reply_ticket).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      description: "Content of the note in HTML format.",
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "The total size of all the ticket's attachments (not just this note) cannot exceed 20MB.",
      optional: true,
    },
    fromEmail: {
      propDefinition: [
        freshdesk,
        "fromEmail",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
      label: "User ID",
      description: "ID of the agent who is adding the note.",
      optional: true,
    },
    ccEmails: {
      type: "string[]",
      label: "CC Emails",
      description: "Email address added in the 'cc' field of the outgoing ticket email.",
      optional: true,
    },
    bccEmails: {
      type: "string[]",
      label: "BCC Emails",
      description: "Email address added in the 'bcc' field of the outgoing ticket email.",
      optional: true,
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    formData.append("body", this.body);

    if (this.fromEmail) {
      formData.append("from_email", this.fromEmail.label);
    }
    if (this.userId) {
      formData.append("user_id", this.userId);
    }
    const parsedCcEmails = parseObject(this.ccEmails);
    if (parsedCcEmails) {
      parsedCcEmails.forEach((ccEmail) => {
        formData.append("cc_emails[]", ccEmail);
      });
    }
    const parsedBccEmails = parseObject(this.bccEmails);
    if (parsedBccEmails) {
      parsedBccEmails.forEach((bccEmail) => {
        formData.append("bcc_emails[]", bccEmail);
      });
    }

    const parsedAttachments = parseObject(this.attachments);
    if (parsedAttachments) {
      for (const attachment of parsedAttachments) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(attachment);
        formData.append("attachments[]", stream, {
          contentType: metadata.contentType,
          knownLength: metadata.size,
          filename: metadata.name,
        });
      };
    }
    const response = await this.freshdesk.createReply({
      $,
      ticketId: this.ticketId,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", `Reply created successfully with ID: ${response.id}`);
    return response;
  },
};
