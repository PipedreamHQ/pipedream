// legacy_hash_id: a_74ibwM
import { axios } from "@pipedream/platform";

export default {
  key: "feedbin-get-subscriptions",
  name: "Get subscriptions",
  description: "GET /v2/subscriptions.json will return all subscriptions.",
  version: "0.1.1",
  type: "action",
  props: {
    feedbin: {
      type: "app",
      app: "feedbin",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.feedbin.com/v2/subscriptions.json",
      auth: {
        username: `${this.feedbin.$auth.email}`,
        password: `${this.feedbin.$auth.password}`,
      },
    });
  },
};
