import common from "../../common/common.mjs";

export default {
  key: "bitly-create-bitlink",
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
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const { long_url, domain, group_guid, title, tags } = this;
    const updatedDeepLink = this.formatDeepLink(this.deeplinks);
    const payload = { long_url, domain, group_guid, title };
    tags && tags.length && (payload.tags = tags);
    updatedDeepLink.length && (payload.deeplinks = updatedDeepLink);
    return await this.createBitlink(
      $,
      payload,
      this.bitly.$auth.oauth_access_token
    );
  },
};
