import base from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "amazon_ses-create-email-template",
  name: "Create Email Template",
  description: "Create a HTML or Plain Text Email Template in Amazon SES. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/createemailtemplatecommand.html)",
  version: "0.0.1",
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
      description: "The email body that will be visible to recipients whose email clients do not display HTML",
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
        Subject: this.Subject,
        Html: this.Html,
        Text: this.Text,
      },
    };
    const response = await this.amazonSes.createEmailTemplate(params);
    $.export("$summary", "Successfully created email template");
    return response;
  },
};
