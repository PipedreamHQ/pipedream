import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-create-user",
  name: "Create User",
  description: "Creates a new user on Thinkific. [See the documentation](https://developers.thinkific.com/api/api-documentation/#/Users/createUser)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thinkific,
    firstName: {
      propDefinition: [
        thinkific,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        thinkific,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        thinkific,
        "email",
      ],
    },
    password: {
      propDefinition: [
        thinkific,
        "password",
      ],
    },
    roles: {
      propDefinition: [
        thinkific,
        "roles",
      ],
    },
    company: {
      propDefinition: [
        thinkific,
        "company",
      ],
    },
    headline: {
      propDefinition: [
        thinkific,
        "headline",
      ],
    },
    affiliateCode: {
      propDefinition: [
        thinkific,
        "affiliateCode",
      ],
    },
    affiliateCommission: {
      propDefinition: [
        thinkific,
        "affiliateCommission",
      ],
    },
    affiliateCommissionType: {
      propDefinition: [
        thinkific,
        "affiliateCommissionType",
      ],
    },
    affiliatePayoutEmail: {
      propDefinition: [
        thinkific,
        "affiliatePayoutEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.thinkific.createUser({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password,
        roles: this.roles,
        company: this.company,
        headline: this.headline,
        affiliate_code: this.affiliateCode,
        affiliate_commission: this.affiliateCommission && +this.affiliateCommission,
        affiliate_commission_type: this.affiliateCommissionType,
        affiliate_payout_email: this.affiliatePayoutEmail,
      },
    });
    $.export("$summary", `Successfully created user with email ${this.email}`);
    return response;
  },
};
