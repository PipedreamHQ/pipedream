// legacy_hash_id: a_bKiP6J
import { axios } from "@pipedream/platform";

export default {
  key: "sendpulse-retrieve-info-for-email-address",
  name: "Retrieve General Information About a Specific Email Address",
  description: "Make a GET request to https://api.sendpulse.com/emails/{email}",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sendpulse: {
      type: "app",
      app: "sendpulse",
    },
    email: {
      type: "string",
      description: "Email address",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.sendpulse.com/emails/${this.email}`,
      headers: {
        Authorization: `Bearer ${this.sendpulse.$auth.oauth_access_token}`,
      },
    });
  },
};
