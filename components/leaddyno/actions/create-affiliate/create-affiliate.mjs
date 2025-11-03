import leaddyno from "../../leaddyno.app.mjs";

export default {
  key: "leaddyno-create-affiliate",
  name: "Create Affiliate",
  description: "Creates a new affiliate in LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/affiliates/post-affiliates)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    leaddyno,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the affiliate",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the affiliate",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the affiliate",
      optional: true,
    },
    affiliateCode: {
      type: "string",
      label: "Affiliate Code",
      description: "A custom affiliate code for the new affiliate",
      optional: true,
    },
    paypalEmail: {
      type: "string",
      label: "PayPal Email",
      description: "The PayPal email address for affiliate payouts",
      optional: true,
    },
    unsubscribed: {
      type: "boolean",
      label: "Unsubscribed",
      description: "Indicates whether the affiliate is unsubscribed from communications",
      optional: true,
    },
    affiliateType: {
      type: "string",
      label: "Affiliate Type",
      description: "The code for the affiliate's group",
      optional: true,
    },
    overrideApproval: {
      type: "boolean",
      label: "Override Approval",
      description: "If set to true, the affiliate will not require approval",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.leaddyno.createAffiliate({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        affiliate_code: this.affiliateCode,
        paypal_email: this.paypalEmail,
        unsubscribed: this.unsubscribed,
        affiliate_type: this.affiliateType,
        override_approval: this.overrideApproval,
      },
    });

    $.export("$summary", `Successfully created affiliate with ID ${response.id}`);

    return response;
  },
};
