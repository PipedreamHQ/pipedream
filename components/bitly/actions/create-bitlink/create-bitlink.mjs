import { ConfigurationError } from "@pipedream/platform";
import bitly from "../../bitly.app.mjs";
import { formatDeepLink } from "../../common/common.utils.mjs";

export default {
  key: "bitly-create-bitlink",
  name: "Create a Bitlink",
  description:
    "Converts a long url to a Bitlink and sets additional parameters.[See the docs here](https://dev.bitly.com/api-reference#createFullBitlink)",
  version: "0.0.1",
  type: "action",
  props: {
    bitly,
    long_url: {
      type: "string",
      description: "URL to shorten",
    },
    title: {
      type: "string",
      optional: true,
      description: "Bitlink title",
    },
    tags: {
      type: "string[]",
      optional: true,
    },
    domain: {
      type: "string",
      optional: true,
      description: "Custom domain. e.g. bit.ly",
    },
    group_guid: {
      type: "string",
      optional: true,
      description: "Group GUID",
    },
    deeplinks: {
      type: "string[]",
      optional: true,
      description: `Provide an object. Each object should represent a row.
        See documentation: https://dev.bitly.com/api-reference#createFullBitlink
        Example:
        \`{
          "app_id":"com.bitly.app",
          "app_uri_path": "/store?id=123456",
          "install_url": "https://play.google.com/store/apps/details?id=com.bitly.app&hl=en_US",
          "install_type": "promote_install"
        }\``,
    },
  },
  async run({ $ }) {
    const { long_url, domain, group_guid, title, tags } = this;
    const updatedDeepLink = formatDeepLink(this.deeplinks);
    const payload = { long_url, domain, group_guid, title };
    tags && tags.length && (payload.tags = tags);
    updatedDeepLink.length && (payload.deeplinks = updatedDeepLink);
    try {
      const response = await this.bitly.createBitlink(payload);
      response && $.export("$summary", "Bitlink created successfully");
      return response;
    } catch (error) {
      throw new ConfigurationError("An error occured creating Bitlink");
    }
  },
};
