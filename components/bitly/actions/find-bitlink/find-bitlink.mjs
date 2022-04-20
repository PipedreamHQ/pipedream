import { ConfigurationError } from "@pipedream/platform";
import { formatDeepLink } from "../../common/common.utils.mjs";
import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-find-bitlink",
  name: "Retrieve a Bitlink",
  description: "Returns information for the specified link.",
  version: "0.0.1",
  type: "action",
  props: {
    bitly,
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
  async run({ $ }) {
    let bitlinkDetail;
    try {
      bitlinkDetail = await this.bitly.getBitlink(this.bitlink);
    } catch (error) {
      if (this.createBitlinkIfNotFound === "Yes") {
        $.export("$summary", "Bitlink not found. Creating new Bitlink");
      } else {
        throw new ConfigurationError("Bitlink not found");
      }
    }

    if (!bitlinkDetail && this.createBitlinkIfNotFound === "Yes") {
      const { long_url, domain, group_guid, title, tags } = this;
      const payload = { long_url, domain, group_guid, title };
      const updatedDeepLink = formatDeepLink(this.deeplinks);

      tags && tags.length && (payload.tags = tags);
      updatedDeepLink.length && (payload.deeplinks = updatedDeepLink);

      try {
        const response = await this.bitly.createBitlink(payload);
        response && $.export("$summary", "Bitlink created successfully");
        return response;
      } catch (error) {
        throw new ConfigurationError("An error occured creating Bitlink");
      }
    }
    return bitlinkDetail;
  },
};
