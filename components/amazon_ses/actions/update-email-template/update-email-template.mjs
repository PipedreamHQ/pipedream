import base from "../common/base.mjs";

export default {
  key: "amazon_ses-update-email-template",
  name: "Update Email Template",
  description: "Update an email template. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/updateemailtemplatecommand.html)",
  version: "0.0.2",
  type: "action",
  props: {
    ...base.props,
    TemplateName: {
      propDefinition: [
        base.props.amazonSes,
        "TemplateName",
        (c) => ({
          region: c.region,
        }),
      ],
    },
    Subject: {
      propDefinition: [
        base.props.amazonSes,
        "Subject",
      ],
      optional: true,
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
    const { TemplateContent } = await this.amazonSes.getEmailTemplate(this.region, {
      TemplateName: this.TemplateName,
    });

    const params = {
      TemplateName: this.TemplateName,
      TemplateContent: {
        Subject: this.amazonSes.replaceCurlyBrackets(this.Subject) ?? TemplateContent.Subject,
        Html: this.amazonSes.replaceCurlyBrackets(this.Html) ?? TemplateContent.Html,
        Text: this.amazonSes.replaceCurlyBrackets(this.Text) ?? TemplateContent.Text,
      },
    };

    const response = await this.amazonSes.updateEmailTemplate(this.region, params);
    $.export("$summary", "Successfully updated email template");
    return response;
  },
};
