import base from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "amazon_ses-send-an-email",
  name: "Send an Email",
  description: "Send an email using Amazon SES. Supports simple email messaging. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/sendemailcommand.html)",
  version: "0.9.0",
  type: "action",
  props: {
    ...base.props,
    ToAddresses: {
      type: "string[]",
      label: "To Addresses",
      description: "An array of recipient email addresses you want to send to",
    },
    CcAddresses: {
      type: "string[]",
      label: "CC Addresses",
      description: "An array of email addresses you want to CC",
      optional: true,
    },
    BccAddresses: {
      type: "string[]",
      label: "BCC Addresses",
      description: "An array of email addresses you want to BCC",
      optional: true,
    },
    ReplyToAddresses: {
      type: "string[]",
      label: "Reply To Addresses",
      description: "An array of reply-to addresses",
      optional: true,
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the email",
    },
    Body: {
      type: "string",
      label: "Text",
      description: "The plaintext email body of the message",
      default: "",
    },
    Html: {
      type: "string",
      label: "HTML",
      description: "The HTML email body of the message",
      optional: true,
    },
    FromEmailAddress: {
      type: "string",
      label: "From",
      description: "The email from which the email is addressed",
    },
  },
  async run({ $ }) {
    if (!(this.Body || this.Html)) {
      throw new ConfigurationError("Email Text or HTML must be supplied");
    }

    const params = {
      Content: {
        Simple: {
          Subject: this.amazonSes.createCharsetContent(this.Subject),
          Body: {
            Text: this.amazonSes.createCharsetContent(this.Body),
          },
        },
      },
      Destination: {
        ToAddresses: this.ToAddresses,
        CcAddresses: this.CcAddresses,
        BccAddresses: this.BccAddresses,
      },
      FromEmailAddress: this.FromEmailAddress,
      ReplyToAddresses: this.ReplyToAddresses,
    };

    if (this.Html) {
      params.Content.Simple.Body.Html = this.amazonSes.createCharsetContent(this.Html);
    }

    const response = await this.amazonSes.sendEmail(params);
    $.export("$summary", "Sent email successfully");
    return response;
  },
};
