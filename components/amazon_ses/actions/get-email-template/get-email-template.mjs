import base from "../common/base.mjs";

export default {
  key: "amazon_ses-get-email-template",
  name: "Get Email Template",
  description: "Get an email template. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sesv2/classes/getemailtemplatecommand.html)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  },
  async run({ $ }) {
    const params = {
      TemplateName: this.TemplateName,
    };
    const response = await this.amazonSes.getEmailTemplate(this.region, params);
    $.export("$summary", "Successfully retrieved email template");
    return response;
  },
};
