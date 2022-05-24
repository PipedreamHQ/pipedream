import base from "../common/base.mjs";

export default {
  key: "amazon_ses-send-templated-email",
  name: "Send Templated Email",
  description: "Send an email replacing the template tags with values using Amazon SES. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendtemplatedemailcommand.html)",
  version: "0.0.1",
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
    FromEmailAddress: {
      type: "string",
      label: "From",
      description: "The email from which the email is addressed",
    },
    Template: {
      propDefinition: [
        base.props.amazonSes,
        "TemplateName",
      ],
    },
    TemplateData: {
      type: "object",
      label: "Template Data",
      description: "A JSON object of replacement values to apply to the template tags",
    },
  },
  async run({ $ }) {
    const params = {
      Destination: {
        ToAddresses: this.ToAddresses,
        CcAddresses: this.CcAddresses,
        BccAddresses: this.BccAddresses,
      },
      Source: this.FromEmailAddress,
      ReplyToAddresses: this.ReplyToAddresses,
      Template: this.Template,
      TemplateData: JSON.stringify(this.TemplateData),
    };

    const response = await this.amazonSes.sendTemplatedEmail(params);
    $.export("$summary", "Sent email successfully");
    return response;
  },
};
