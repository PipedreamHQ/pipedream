import common from "../../common/common.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bitly-find-bitlink",
  name: "Retrieve a Bitlink",
  description: "Returns information for the specified link.",
  version: "0.0.1",
  type: "action",
  props: {
    bitly: {
      type: "app",
      app: "bitly",
    },
    bitlink: {
      type: "string",
      description: "Bitlink url",
    },
    createBitlinkIfNotFound: {
      label: "Create a new bitlink if the bitlink is not found?",
      description:
        "Create a new bitlink if no record is found for the specified bitlink.",
      type: "string",
      options: ["Yes", "No"],
      default: "No",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.createBitlinkIfNotFound === "Yes") {
      props["long_url"] = {
        type: "string",
        description: "URL to shorten",
      };
      props["title"] = {
        type: "string",
        optional: true,
        description: "Bitlink title",
      };
      props["tags"] = {
        type: "string[]",
        optional: true,
      };
      props["domain"] = {
        type: "string",
        description:
          "Bitlinks that contain deeplinks configured with a custom domain",
        optional: true,
      };
      props["group_guid"] = {
        type: "string",
        optional: true,
        description: "Group GUID",
      };
      props["deeplinks"] = {
        type: "string[]",
        optional: true,
        description: `Provide an object. Each object should represent a row. (e.g. {"app_id":"com.bitly.app","app_uri_path": "/store?id=123456","install_url": "https://play.google.com/store/apps/details?id=com.bitly.app&hl=en_US","install_type": "promote_install" })`,
      };
    }
    return props;
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    let result;
    try {
      result = await axios($, {
        method: "get",
        url: `https://api-ssl.bitly.com/v4/bitlinks/${this.bitlink}`,
        headers: {
          Authorization: `Bearer ${this.bitly.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {}

    if (!result && this.createBitlinkIfNotFound === "Yes") {
      const updatedDeepLink = this.formatDeepLink(this.deeplinks);
      const payload = {
        long_url: this.long_url,
        domain: this.domain,
        group_guid: this.group_guid,
        title: this.title,
      };
      this.tags && this.tags.length && (payload.tags = this.tags);
      updatedDeepLink.length && (payload.deeplinks = updatedDeepLink);
      return await this.createBitlink(
        $,
        payload,
        this.bitly.$auth.oauth_access_token
      );
    }
    return result;
  },
};
