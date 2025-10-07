import smtp2go from "../../app/smtp2go.app";
import common from "../common";

export default {
  ...common,
  key: "smtp2go-send-single-email",
  name: "Send Single Email",
  description: "Send a single email with SMTP2GO [(See docs here)](https://apidoc.smtp2go.com/documentation/#/POST%20/email/send)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smtp2go,
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
        **Required** if no \`Text Body\` is specified.`,
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
    ...common.props,
  },
  async run({ $ }) {
    const data = {
      ...this.getActionRequestCommonData(),
      subject: this.subject,
      html_body: this.htmlBody,
      text_body: this.textBody,
    };
    if (!data.html_body && !data.text_body) {
      throw new Error("You must have EITHER a text body or an html body. Neither were provided.");
    }
    const response = await this.smtp2go.sendSingleEmail($, data, this.ignoreFailures);
    $.export("$summary", `Sent email successfully with email ID ${response.data.email_id}`);
    return response;
  },
};
