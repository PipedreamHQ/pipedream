import app from "../../servicem8.app.mjs";
import { coercePipedreamString } from "../../common/payload.mjs";

export default {
  key: "servicem8-send-email",
  name: "Send Email",
  description: "Send an email via the Messaging API. [See the documentation](https://developer.servicem8.com/reference/send_email)",
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
      description:
        `HTML email body.
\\
**Required** if no \`Text Body\` is specified.`,
      optional: true,
    },
    textBody: {
      type: "string",
      label: "Text Body",
      description:
        `Plain text body.
\\
**Required** if no \`HTML Body\` is specified.`,
      optional: true,
    },
    cc: {
      type: "string",
      label: "CC",
      description: "Optional carbon-copy recipient email address",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Optional reply-to email address",
      optional: true,
    },
    regardingJobUUID: {
      type: "string",
      label: "Regarding Job UUID",
      description: "Optional job UUID to link the email to the job diary",
      optional: true,
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
    },
    impersonateStaffUuid: {
      type: "string",
      label: "Impersonate Staff UUID",
      description: "Required when using the platform-user-signature tag in the body (x-impersonate-uuid header)",
      optional: true,
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const htmlBody = coercePipedreamString(this.htmlBody);
    const textBody = coercePipedreamString(this.textBody);
    if (!htmlBody && !textBody) {
      throw new Error("At least one of HTML Body or Text Body is required (non-empty).");
    }

    const data = {
      to: coercePipedreamString(this.to),
      subject: coercePipedreamString(this.subject),
    };
    if (htmlBody) {
      data.htmlBody = htmlBody;
    }
    if (textBody) {
      data.textBody = textBody;
    }
    const cc = coercePipedreamString(this.cc);
    if (cc) {
      data.cc = cc;
    }
    const replyTo = coercePipedreamString(this.replyTo);
    if (replyTo) {
      data.replyTo = replyTo;
    }
    const regardingJob = coercePipedreamString(this.regardingJobUUID);
    if (regardingJob) {
      data.regardingJobUUID = regardingJob;
    }

    const impersonate = coercePipedreamString(this.impersonateStaffUuid);
    const response = await this.servicem8.sendEmail({
      $,
      data,
      ...(impersonate && {
        headers: {
          "x-impersonate-uuid": impersonate,
        },
      }),
    });
    $.export("$summary", "Email submitted to ServiceM8");
    return response;
  },
};
