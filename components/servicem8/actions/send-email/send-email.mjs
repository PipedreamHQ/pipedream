import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-send-email",
  name: "Send Email",
  description: "Send an email via the ServiceM8 Messaging API. [See the documentation](https://developer.servicem8.com/reference/send_email)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    to: {
      type: "string",
      label: "To",
      description: "Recipient email address",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject",
    },
    htmlBody: {
      type: "string",
      label: "HTML Body",
      description: "HTML body (provide htmlBody and/or textBody)",
      optional: true,
    },
    textBody: {
      type: "string",
      label: "Text Body",
      description: "Plain text body (provide htmlBody and/or textBody)",
      optional: true,
    },
    cc: {
      type: "string",
      label: "CC",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      optional: true,
    },
    regardingJobUUID: {
      type: "string",
      label: "Regarding Job UUID",
      description: "Optional job UUID to link the email to the job diary",
      optional: true,
    },
    impersonateStaffUuid: {
      type: "string",
      label: "Impersonate Staff UUID",
      description: "Required when using the platform-user-signature tag in the body (x-impersonate-uuid header)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      to: this.to,
      subject: this.subject,
    };
    if (this.htmlBody !== undefined) data.htmlBody = this.htmlBody;
    if (this.textBody !== undefined) data.textBody = this.textBody;
    if (this.cc) data.cc = this.cc;
    if (this.replyTo) data.replyTo = this.replyTo;
    if (this.regardingJobUUID) data.regardingJobUUID = this.regardingJobUUID;

    const response = await this.servicem8.sendEmail({
      $,
      data,
      ...(this.impersonateStaffUuid && {
        headers: {
          "x-impersonate-uuid": this.impersonateStaffUuid,
        },
      }),
    });
    $.export("$summary", "Email submitted to ServiceM8");
    return response;
  },
};
