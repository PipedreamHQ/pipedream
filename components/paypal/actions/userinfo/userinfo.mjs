// legacy_hash_id: a_Mdi8Y8
import { axios } from "@pipedream/platform";

export default {
  key: "paypal-userinfo",
  name: "Get user info",
  description: "Shows user profile information. Filters the response by a schema.",
  version: "0.1.1",
  type: "action",
  props: {
    paypal: {
      type: "app",
      app: "paypal",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.paypal.com/v1/identity/oauth2/userinfo",
      params: {
        schema: "paypalv1.1",
      },
      headers: {
        Authorization: `Bearer ${this.paypal.$auth.oauth_access_token}`,
      },
    });
  },
};
