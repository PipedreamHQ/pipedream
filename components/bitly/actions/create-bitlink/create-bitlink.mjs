import bitly from "../../bitly.app.mjs";
import { formatArrayStrings } from "../../common/common.utils.mjs";
import constants from "../../common/common.constants.mjs";

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
      label: "Long url",
      description: "URL to shorten",
    },
    title: {
      type: "string",
      optional: true,
      label: "Bitlink title",
    },
    tags: {
      type: "string[]",
      optional: true,
    },
    domain: {
      type: "string",
      optional: true,
      label: "Custom domain. e.g. bit.ly",
    },
    group_guid: {
      type: "string",
      optional: true,
      label: "Group guid",
    },
    deeplinks: {
      type: "string[]",
      optional: true,
      label: "Deeplinks",
      description: `Provide an object. Each object should represent a row.
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
    const { long_url, deeplinks, domain, group_guid, title, tags } = this;
    const updatedDeepLink = formatArrayStrings(
      deeplinks,
      constants.ALLOWED_DEEPLINK_KEYS,
      "deeplinks"
    );
    const payload = { long_url, domain, group_guid, title };
    tags?.length && (payload.tags = tags);
    updatedDeepLink?.length && (payload.deeplinks = updatedDeepLink);
    const response = await this.bitly.createBitlink(payload);
    response && $.export("$summary", "Bitlink created successfully");
    return response;
  },
};
