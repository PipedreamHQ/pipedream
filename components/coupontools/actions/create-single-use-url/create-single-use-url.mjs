import coupontools from "../../coupontools.app.mjs";

export default {
  key: "coupontools-create-single-use-url",
  name: "Create Single Use URL",
  description: "Create a single-use URL for a coupon. Prefill data like first name, last name, custom validation code, etc. [See the documentation](https://docs.coupontools.com/api/coupon#create-single-use)",
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
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the user",
      optional: true,
    },
    customId: {
      type: "string",
      label: "Custom ID",
      description: "A custom ID for the user",
      optional: true,
    },
    customValCode: {
      type: "string",
      label: "Custom Validation Code",
      description: "A custom validation code for the user",
      optional: true,
    },
    duplicateCheck: {
      type: "boolean",
      label: "Duplicate Check",
      description: "If enabled, will verify if the same user input already received a single-use URL for that coupon based on the selected field (email, phone, or customid), and return the duplicated session instead of creating a new session",
      optional: true,
    },
    expiryDate: {
      type: "string",
      label: "Expiry Date",
      description: "The expiry date of the single-use URL Format: yyyy-MM-dd HH:mm:ss",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.coupontools.createSingleUseURL({
      $,
      data: {
        campaign: this.couponId,
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        phone: this.phone,
        customid: this.customId,
        customvalcode: this.customValCode,
        duplicate_check: this.duplicateCheck,
        expiry_date: this.expiryDate,
      },
    });

    $.export("$summary", `Single use URL created successfully: "${response.single_use_url}"`);
    return response;
  },
};
