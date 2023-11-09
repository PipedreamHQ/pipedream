import bigmailer from "../../bigmailer.app.mjs";

export default {
  key: "bigmailer-send-transactional-email",
  name: "Send Transactional Email",
  description: "Sends an email as part of a transactional campaign. [See the documentation](https://docs.bigmailer.io/reference/sendtransactionalcampaign)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bigmailer,
    brandId: {
      propDefinition: [
        bigmailer,
        "brandId",
      ],
    },
    campaignId: {
      propDefinition: [
        bigmailer,
        "campaignId",
        (c) => ({
          brandId: c.brandId,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    fieldValues: {
      type: "object",
      label: "Field Values",
      description: "Field values are saved along with the email as part of the contact. Additionally, they are used as variables when generating the email content (body, subject, and recipient name). Each name must match the tag name of a field that exists in the brand. Each field value must have exactly one of string, integer, or date.",
      optional: true,
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "Variables to substitute into the email content (body, subject, and recipient name). Unlike field_values, they are NOT saved as part of the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      field_values: this.fieldValues,
      variables: this.variables,
    };
    const response = await this.bigmailer.sendTransactionalCampaign({
      brandId: this.brandId,
      campaignId: this.campaignId,
      data,
    });
    $.export("$summary", "Email sent successfully");
    return response;
  },
};
