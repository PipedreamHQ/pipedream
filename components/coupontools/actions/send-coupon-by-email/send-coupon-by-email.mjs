import coupontools from "../../coupontools.app.mjs";

export default {
  key: "coupontools-send-coupon-by-email",
  name: "Send Coupon by Email",
  description: "Send a coupon by email. [See the documentation](https://docs.coupontools.com/api/coupon#send-by-email)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coupontools,
    couponId: {
      propDefinition: [
        coupontools,
        "couponId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the recipient",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the recipient",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the recipient",
      optional: true,
    },
    checkUnique: {
      type: "boolean",
      label: "Check Unique",
      description: "Check if email address already received coupon. When not unique, email will not send.",
      optional: true,
    },
    couponSession: {
      type: "string",
      label: "Coupon Session",
      description: "Unique session code. If not defined, a new coupon session will be created.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.coupontools.sendCouponByEmail({
      $,
      data: {
        campaign: this.couponId,
        email: this.email,
        subject: this.subject,
        firstname: this.firstName,
        lastname: this.lastName,
        check_unique: this.checkUnique,
        couponsession: this.couponSession,
      },
    });
    if (response.action === "email_sent") {
      $.export("$summary", `Successfully sent coupon to ${this.email}`);
    }
    return response;
  },
};
