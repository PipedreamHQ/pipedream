import common from "../common/common.mjs";

const {
  postmark, ...props
} = common.props;

export default {
  ...common,
  key: "postmark-send-single-email",
  name: "Send Single Email",
  description: "Send a single email with Postmark [See the documentation](https://postmarkapp.com/developer/api/email-api#send-a-single-email)",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject.",
    },
    htmlBody: {
      type: "string",
      label: "HTML Body",
      description:
        `HTML email message.
        \\
        **Required** if no \`Text Body\` is specified.
        \\
        **Required** to enable \`Open Tracking\`.`,
      optional: true,
    },
    textBody: {
      type: "string",
      label: "Text Body",
      description:
        `Plain text email message.
        \\
        **Required** if no \`HTML Body\` is specified.`,
      optional: true,
    },
    // The above props are intentionally placed first
    ...props,
  },
  async run({ $ }) {
    const response = await this.postmark.sendSingleEmail({
      $,
      data: {
        ...this.getActionRequestCommonData(),
        Subject: this.subject,
        HtmlBody: this.htmlBody,
        TextBody: this.textBody,
      },
    });
    $.export("$summary", "Sent email successfully");
    return response;
  },
};
