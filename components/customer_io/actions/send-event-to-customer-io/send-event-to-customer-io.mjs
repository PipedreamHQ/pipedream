// legacy_hash_id: a_3Li6eK
import { axios } from "@pipedream/platform";

export default {
  key: "customer_io-send-event-to-customer-io",
  name: "Send Event To Customer io",
  description: "Sends, tracks a customer event to Customer io",
  version: "0.2.2",
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
    event_name: {
      type: "string",
      description: "The name of the event to track.",
    },
    type: {
      type: "string",
      description: "Used to change event type. For Page View events set to \"page\".",
      optional: true,
    },
    custom_data: {
      type: "object",
      description: "Custom data to include with the event.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://customer.io/docs/api/#apitrackeventsevent_add

    if (!this.customer_id || !this.event_name) {
      throw new Error("Must provide customer_id, and event_name parameters.");
    }

    const basicauthUserPwd = `${this.customer_io.$auth.site_id}:${this.customer_io.$auth.api_key}`;
    const buff = Buffer.from(basicauthUserPwd);
    const base64BasicauthUserPwd = buff.toString("base64");

    const config = {
      method: "post",
      url: `https://track.customer.io/api/v1/customers/${this.customer_id}/events`,
      headers: {
        Authorization: `Basic ${base64BasicauthUserPwd}`,
      },
      data: {
        name: this.event_name,
        type: this.type,
        data: this.custom_data,
      },
    };

    return axios($, config);
  },
};
