import common from "../../common/common.mjs";

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
      description:
        "Bitlinks that contain deeplinks configured with a custom domain",
    },
    group_guid: {
      type: "string",
      optional: true,
      description: "Group GUID",
    },
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const payload = {
      long_url: this.long_url,
      domain: this.domain,
      group_guid: this.group_guid,
      title: this.title,
    };
    this.tags && this.tags.length && (payload.tags = this.tags);
    const result = await this.createBitlink(
      $,
      payload,
      this.bitly.$auth.oauth_access_token
    );
    console.log("result", result);
    return result;
  },
};
