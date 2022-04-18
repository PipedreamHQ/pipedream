import { axios } from "@pipedream/platform";

export default {
  key: "create-bitlink",
  name: "Create a Bitlink",
  description:
    "Converts a long url to a Bitlink and sets additional parameters.",
  version: "0.0.1",
  type: "action",
  props: {
    bitly: {
      type: "app",
      app: "bitly",
    },
    long_url: {
      type: "string",
    },
    title: {
      type: "string",
      optional: true,
    },
    tags: {
      type: "string[]",
      optional: true,
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
    const payload = {
      long_url: this.long_url,
      domain: this.domain,
      group_guid: this.group_guid,
      title: this.title,
    };
    this.tags && this.tags.length && (payload.tags = this.tags);
    return await axios($, {
      method: "post",
      url: "https://api-ssl.bitly.com/v4/bitlinks",
      headers: {
        Authorization: `Bearer ${this.bitly.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  },
};
