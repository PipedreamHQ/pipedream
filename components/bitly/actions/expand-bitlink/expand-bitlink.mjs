import { axios } from "@pipedream/platform";

export default {
  key: "bitly-expand-bitlink",
  name: "Expand a Bitlink",
  description: "Retrieves information about Bitlink using ID.",
  version: "0.0.1",
  type: "action",
  props: {
    bitly: {
      type: "app",
      app: "bitly",
    },
    bitlink_id: {
      type: "string",
      description: "Bitlink ID",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: "https://api-ssl.bitly.com/v4/expand",
      headers: {
        Authorization: `Bearer ${this.bitly.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
      data: {
        bitlink_id: this.bitlink_id,
      },
    });
  },
};
