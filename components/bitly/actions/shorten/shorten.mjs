// legacy_hash_id: a_B0i8Rr
import { axios } from "@pipedream/platform";

export default {
  key: "bitly-shorten",
  name: "Shorten a Link",
  description: "Converts a long url to a Bitlink.",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bitly: {
      type: "app",
      app: "bitly",
    },
    long_url: {
      type: "string",
    },
    domain: {
      type: "string",
      optional: true,
    },
    group_guid: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: "https://api-ssl.bitly.com/v4/shorten",
      headers: {
        "Authorization": `Bearer ${this.bitly.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
      data: {
        long_url: this.long_url,
        domain: this.domain,
        group_guid: this.group_guid,
        //
      },
    });
  },
};
