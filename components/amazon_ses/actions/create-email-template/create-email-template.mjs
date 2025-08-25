import base from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "amazon_ses-create-email-template",
  name: "Create Email Template",
  description: "Create a HTML or a plain text email template. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/createemailtemplatecommand.html)",
  version: "0.0.2",
  type: "action",
  props: {
    ...base.props,
    TemplateName: {
      type: "string",
      label: "Template Name",
      description: "The email template name",
    },
    Subject: {
      propDefinition: [
        base.props.amazonSes,
        "Subject",
      ],
    },
    Html: {
      propDefinition: [
        base.props.amazonSes,
        "Html",
      ],
      optional: true,
    },
    Text: {
      propDefinition: [
        base.props.amazonSes,
        "Text",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.Html && !this.Text) {
      throw new ConfigurationError("Html or Text must be configured");
    }

    const params = {
      TemplateName: this.TemplateName,
      TemplateContent: {
        Subject: this.amazonSes.replaceCurlyBrackets(this.Subject),
        Html: this.amazonSes.replaceCurlyBrackets(this.Html),
        Text: this.amazonSes.replaceCurlyBrackets(this.Text),
      },
    };
    const response = await this.amazonSes.createEmailTemplate(this.region, params);
    $.export("$summary", "Successfully created email template");
    return response;
  },
};
