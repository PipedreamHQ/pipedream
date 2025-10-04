import bitly from "../../bitly.app.mjs";
import { formatArrayStrings } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bitly-create-bitlink",
  name: "Create a Bitlink",
  description:
    "Converts a long url to a Bitlink and sets additional parameters.[See the docs here](https://dev.bitly.com/api-reference#createFullBitlink)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bitly,
    longUrl: {
      type: "string",
      label: "Long url",
      description: "URL to shorten",
    },
    title: {
      type: "string",
      optional: true,
      label: "Bitlink title",
      description: "Bitlink title",
    },
    tags: {
      type: "string[]",
      optional: true,
      label: "Tags",
      description: "Enter array of tags",
    },
    domain: {
      type: "string",
      optional: true,
      description: "Custom domain. e.g. bit.ly",
      label: "Custom domain",
    },
    groupGuid: {
      type: "string",
      optional: true,
      label: "Group guid",
      description: "Group guid",
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
    const {
      deeplinks,
      domain,
      title,
      tags,
    } = this;
    const updatedDeepLink = formatArrayStrings(
      deeplinks,
      constants.ALLOWED_DEEPLINK_KEYS,
      "deeplinks",
    );
    const payload = {
      long_url: this.longUrl,
      domain,
      group_guid: this.groupGuid,
      title,
    };
    tags?.length && (payload.tags = tags);
    updatedDeepLink?.length && (payload.deeplinks = updatedDeepLink);
    const response = await this.bitly.createBitlink(payload);
    response && $.export("$summary", "Bitlink created successfully");
    return response;
  },
};
