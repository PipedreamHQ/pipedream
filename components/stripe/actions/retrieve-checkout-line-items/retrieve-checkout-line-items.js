import { axios } from "@pipedream/platform";
const stripe = require("../../stripe.app.js");

export default {
  name: "Retrieve Checkout Session Line Items",
  description: "Given a checkout session ID, retrieve the line items. [See the docs](https://stripe.com/docs/api/checkout/sessions/line_items)",
  key: "retrieve_checkout_session_line_items",
  version: "0.0.1",
  type: "action",
  props: {
    stripe,
    checkout_session_id: {
      type: "string",
      label: "Checkout Session ID",
      description: "The ID of a Stripe Checkout Session. [See the docs](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-id)",
      optional: false,
    },
    line_items_limit: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to retrieve (min: 1, max: 100)",
      optional: false,
      default: 1,
      min: 1,
      max: 100,
    },
  },
  async run ({ $ }) {
    const resp = await axios($, {
      url: `https://api.stripe.com/v1/checkout/sessions/${this.checkout_session_id}/line_items?limit=${this.line_items_limit}`,
      auth: {
        username: `${this.stripe.$auth.api_key}`,
        password: "",
      },
    });
    $.export("$summary", `Successfully retrieved ${resp.data.length} checkout session line items`);
    return resp;
  },
};
