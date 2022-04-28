import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bitly-expand-bitlink",
  name: "Expand a Bitlink",
  description:
    "Retrieves information about Bitlink using id. [See the docs here](https://dev.bitly.com/api-reference#expandBitlink)",
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
    const { bitlink_id } = this;
    const data = { bitlink_id };

    try {
      return await axios($, {
        method: "post",
        url: "https://api-ssl.bitly.com/v4/expand",
        headers: {
          Authorization: `Bearer ${this.bitly.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data,
      });
    } catch (error) {
      throw new ConfigurationError("An error occured expanding Bitlink");
    }
  },
};
