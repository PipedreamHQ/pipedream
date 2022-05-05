// legacy_hash_id: a_WYi4wz
import { axios } from "@pipedream/platform";

export default {
  key: "customer_io-create-or-update-customer",
  name: "Create or Update Customer",
  description: "Creates or update a customer.",
  version: "0.1.4",
  type: "action",
  props: {
    customer_io: {
      type: "app",
      app: "customer_io",
    },
    customer_id: {
      type: "string",
      description: "The unique identifier for the customer.",
    },
    email: {
      type: "string",
      description: "The unique identifier for the customer.",
    },
    created_at: {
      type: "string",
      description: "The UNIX timestamp from when the user was created in your system.",
      optional: true,
    },
    attributes: {
      type: "object",
      description: "Custom attributes to define the customer.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://customer.io/docs/api/#apitrackcustomerscustomers_update

    if (!this.customer_id) {
      throw new Error("Must provide customer_id parameter.");
    }

    const basicauthUserPwd = `${this.customer_io.$auth.site_id}:${this.customer_io.$auth.api_key}`;
    const buff = Buffer.from(basicauthUserPwd);
    const base64BasicauthUserPwd = buff.toString("base64");

    const config = {
      method: "put",
      url: `https://track.customer.io/api/v1/customers/${this.customer_id}`,
      headers: {
        Authorization: `Basic ${base64BasicauthUserPwd}`,
      },
      data: {
        email: this.email,
        created_at: this.created_at,
        ...this.attributes,
      },
    };

    return axios($, config);
  },
};
