import app from "../../pandadoc.app.mjs";
import { axios } from "@pipedream/platform";

export default defineComponent({
  key: "pandadoc-send-document",
  name: "Send Document",
  description: "Move a document to sent status and send an optional email. [See the documentation](https://developers.pandadoc.com/reference/send-document)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Value that will be used as the email subject.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description:
        "A message which will be sent by email with a link to a document to sign.",
      optional: true,
    },
    silent: {
      type: "boolean",
      label: "Silent",
      description:
        `Disables sent, viewed, comment and completed email notifications for document recipients and the document sender. By default, notifications emails are sent for specific actions. If set as true, it won't affect "Approve document" email notification sent to the Approver.`,
      optional: true,
      default: false,
    },
    sender: {
      type: "object",
      label: "Sender",
      description: "Set a sender of the document.",
      optional: true,
    },
    forwarding_allowed: {
      type: "boolean",
      label: "Forwarding Allowed",
      description:
        "Your recipient will be able/not able to forward the document to another email address.",
      optional: true,
      default: false,
    },
    forwarding_with_reassigning_allowed: {
      type: "boolean",
      label: "Forwarding With Reassigning Allowed",
      description:
        "Your recipient will be able/not able to forward the right to fill out all fields (including signature) assigned to them to another email address.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const documentId = this.documentId;

    const data = {
      subject: this.subject,
      message: this.message,
      silent: this.silent,
      sender: this.sender,
      forwarding_settings: {
        forwarding_allowed: this.forwarding_allowed,
        forwarding_with_reassigning_allowed:
          this.forwarding_with_reassigning_allowed,
      },
    };

    const response = await this.app.sendDocument({
      $,
      documentId,
      data,
    });

    $.export("$summary", `Successfully sent "${response.name}" document with ID: ${response.id} to ${response.recipients.length} recipient(s)`);
    return response;
  },
});
