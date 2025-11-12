import base from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "amazon_ses-send-email",
  name: "Send Email",
  description: "Send an email using Amazon SES. Supports simple email messaging. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/sendemailcommand.html)",
  version: "0.9.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    ToAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "ToAddresses",
      ],
    },
    CcAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "CcAddresses",
      ],
    },
    BccAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "BccAddresses",
      ],
    },
    ReplyToAddresses: {
      propDefinition: [
        base.props.amazonSes,
        "ReplyToAddresses",
      ],
    },
    Subject: {
      propDefinition: [
        base.props.amazonSes,
        "Subject",
      ],
    },
    Text: {
      propDefinition: [
        base.props.amazonSes,
        "Text",
      ],
      default: "",
    },
    Html: {
      propDefinition: [
        base.props.amazonSes,
        "Html",
      ],
      optional: true,
    },
    FromEmailAddress: {
      propDefinition: [
        base.props.amazonSes,
        "FromEmailAddress",
      ],
    },
  },
  async run({ $ }) {
    if (!(this.Text || this.Html)) {
      throw new ConfigurationError("Email Text or HTML must be supplied");
    }

    const params = {
      Content: {
        Simple: {
          Subject: this.amazonSes.createCharsetContent(this.Subject),
          Body: {
            Text: this.amazonSes.createCharsetContent(this.Text),
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

    const response = await this.amazonSes.sendEmail(this.region, params);
    $.export("$summary", "Sent email successfully");
    return response;
  },
};
