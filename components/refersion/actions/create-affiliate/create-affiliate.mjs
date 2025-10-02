import app from "../../refersion.app.mjs";
import options from "../../common/options.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Affiliate",
  description: "Create a new affiliate. [See the docs here](https://www.refersion.dev/reference/new_affiliate)",
  key: "refersion-create-affiliate",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the affiliate",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the affiliate",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the affiliate",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Has at least 9 characters. The password is NOT more than 72 characters. Has at least 1 upper case character. Has at least 1 lower case character. Has at least 1 numerical character. Has at least 1 special character. Does NOT have the same character repeated more than 3 times in a row. Password does NOT match the email of the user.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the affiliate",
      options: options.AFFILIATE_STATUS,
    },
    offer: {
      type: "string",
      label: "Offer",
      description: "Specific Offer ID to opt affiliate into, otherwise your default offer is used.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the affiliate",
      optional: true,
    },
    paypalEmail: {
      type: "string",
      label: "Paypal Email",
      description: "Paypal email of the affiliate",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "Address 1 of the affiliate",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "Address 2 of the affiliate",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the affiliate",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the affiliate",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip of the affiliate",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the affiliate",
      optional: true,
      options: options.COUNTRIES,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone of the affiliate",
      optional: true,
    },
    sendWelcome: {
      type: "boolean",
      label: "Send Welcome",
      description: "Send welcome email to affiliate",
      optional: true,
    },
    conversionTriggerCoupon: {
      type: "string",
      label: "Conversion Trigger Coupon",
      description: "A unique coupon code to assign to this affiliate as a conversion trigger.",
      optional: true,
    },
    uniqueMerchantId: {
      type: "string",
      label: "Unique Merchant ID",
      description: "An optional alphanumeric identifier for the affiliate for your team's internal use.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      status: this.status,
      offer: this.offer,
      company: this.company,
      paypal_email: this.paypalEmail,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      phone: this.phone,
      send_welcome: this.sendWelcome
        ? "TRUE"
        : "FALSE",
      conversion_trigger_coupon: this.conversionTriggerCoupon,
      unique_merchant_id: this.uniqueMerchantId,
    };
    const res = await this.app.createAffiliate(data, $);
    if (res.error) {
      throw new ConfigurationError(res.error);
    }
    $.export("$summary", `Affiliate successfully created with id "${res.id}"`);
    return res;
  },
};
