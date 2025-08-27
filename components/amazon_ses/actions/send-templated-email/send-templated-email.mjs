import base from "../common/base.mjs";

export default {
  key: "amazon_ses-send-templated-email",
  name: "Send Templated Email",
  description: "Send an email replacing the template tags with values using Amazon SES. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendtemplatedemailcommand.html)",
  version: "0.0.2",
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
    FromEmailAddress: {
      propDefinition: [
        base.props.amazonSes,
        "FromEmailAddress",
      ],
    },
    Template: {
      propDefinition: [
        base.props.amazonSes,
        "TemplateName",
        (c) => ({
          region: c.region,
        }),
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

    const response = await this.amazonSes.sendTemplatedEmail(this.region, params);
    $.export("$summary", "Sent email successfully");
    return response;
  },
};
