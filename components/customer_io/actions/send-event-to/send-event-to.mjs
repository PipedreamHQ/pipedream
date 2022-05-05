// legacy_hash_id: a_JmiL6k
import { axios } from "@pipedream/platform";

export default {
  key: "customer_io-send-event-to",
  name: "POST /customers/{customer_id}/events",
  description: "Sends an event to Customer.io.",
  version: "0.1.2",
  type: "action",
  props: {
    customer_io: {
      type: "app",
      app: "customer_io",
    },
    event_name: {
      type: "string",
    },
    data: {
      type: "object",
      optional: true,
    },
    customer_id: {
      type: "string",
    },
  },
  async run({ $ }) {
    const data = {
      name: this.event_name,
      data: this.data,
    };
    const config = {
      method: "post",
      url: `https://track.customer.io/api/v1/customers/${this.customer_id}/events`,
      auth: {
        username: this.customer_io.$auth.site_id,
        password: this.customer_io.$auth.api_key,
      },
      data,
    };
    return axios($, config);
  },
};
