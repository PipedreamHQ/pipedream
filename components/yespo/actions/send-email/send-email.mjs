import { parseObject } from "../../common/utils.mjs";
import yespo from "../../yespo.app.mjs";

export default {
  key: "yespo-send-email",
  name: "Send Email",
  description: "Generates and sends an email using the assigned template. [See the documentation](https://docs.yespo.io/reference/sendemail-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    yespo,
    from: {
      type: "string",
      label: "From",
      description: "Sender address (enter one of the valid sender addresses).",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Message subject.",
    },
    htmlText: {
      type: "string",
      label: "HTML Text",
      description: "Message HTML code.",
    },
    plainText: {
      type: "string",
      label: "Plain Text",
      description: "Version of the message in plain text.",
      optional: true,
    },
    ampHtmlText: {
      type: "string",
      label: "AMP HTML Text",
      description: "Message AMP HTML code.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The list of recipients.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The list of tags assigned to the message.",
      optional: true,
    },
    externalRequestId: {
      type: "string",
      label: "External Request Id",
      description: "External request ID. It is the same for all the recipients.",
      optional: true,
    },
    skipPersonalisation: {
      type: "boolean",
      label: "Skip Personalisation",
      description: "Skip the application of personalization to the message.",
      optional: true,
    },
    subscriptionKeys: {
      type: "string[]",
      label: " Subscription Keys",
      description: "Array of subscription category keys added to the message.",
      optional: true,
    },
    trackUrls: {
      type: "boolean",
      label: "Track URLs",
      description: "The parameter determines whether to track links in the message or not. The default value is 'true'.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.yespo.sendEmail({
      $,
      data: {
        from: this.from,
        subject: this.subject,
        htmlText: this.htmlText,
        plainText: this.plainText,
        ampHtmlText: this.ampHtmlText,
        emails: this.emails && parseObject(this.emails),
        tags: this.tags && parseObject(this.tags),
        externalRequestId: this.externalRequestId,
        skipPersonalisation: this.skipPersonalisation,
        subscriptionKeys: this.subscriptionKeys && parseObject(this.subscriptionKeys),
        trackUrls: this.trackUrls,
      },
    });

    $.export("$summary", `Email sent successfully to ${this.emails.length} recipients!`);
    return response;
  },
};
