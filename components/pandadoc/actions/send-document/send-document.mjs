import app from "../../pandadoc.app.mjs";

export default defineComponent({
  key: "pandadoc-send-document",
  name: "Send Document",
  description: "Move a document to sent status and send an optional email. [See the documentation](https://developers.pandadoc.com/reference/send-document)",
  type: "action",
  version: "0.0.3",
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
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "Set a sender (email) for the document. Must be an email which is a member on your account.",
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

    let documentStatus = "";

    while (documentStatus !== "document.draft") {
      try {
        const response = await this.app.getDocument({
          id: documentId,
        });
        docStatus = response.status;
        if (docStatus == "document.draft") break;
        console.log(
          `Document status is '${documentStatus}' and not 'document.draft'. Waiting 1s and trying again...`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      } catch (error) {
        console.error("Error fetching document details:", error);
      }
    }

    const data = {
      subject: this.subject,
      message: this.message,
      silent: this.silent,
      forwarding_settings: {
        forwarding_allowed: this.forwarding_allowed,
        forwarding_with_reassigning_allowed:
          this.forwarding_with_reassigning_allowed,
      },
    };

    if (this.senderEmail) {
      data.sender = {
        email: this.senderEmail,
      };
    }

    const response = await this.app.sendDocument({
      $,
      documentId,
      data,
    });

    $.export("$summary", `Successfully sent "${response.name}" document with ID: ${response.id} to ${response.recipients.length} recipient(s)`);
    return response;
  },
});
