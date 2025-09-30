import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-update-user",
  name: "Update User",
  description: "Updates the information of a specific user on Thinkific. [See the documentation](https://developers.thinkific.com/api/api-documentation/#/Users/updateUserByID)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thinkific,
    userId: {
      propDefinition: [
        thinkific,
        "userId",
      ],
    },
    firstName: {
      propDefinition: [
        thinkific,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        thinkific,
        "lastName",
      ],
      optional: true,
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
    const response = await this.thinkific.updateUser({
      $,
      userId: this.userId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
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
    $.export("$summary", `Successfully updated user ${this.userId}`);
    return response;
  },
};
