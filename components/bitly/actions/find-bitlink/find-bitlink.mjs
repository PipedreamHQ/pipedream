import { ConfigurationError } from "@pipedream/platform";
import { formatArrayStrings } from "../../common/common.utils.mjs";
import constants from "../../common/common.constants.mjs";
import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-find-bitlink",
  name: "Retrieve a Bitlink",
  description:
    "Finds an existing Bitlink in your account. Optionally, creates one if none are found.  [See the docs here](https://dev.bitly.com/api-reference#expandBitlink)",
  version: "0.0.1",
  type: "action",
  props: {
    bitly,
    bitlink: {
      type: "string",
      label: "Bitlink url",
    },
    createBitlinkIfNotFound: {
      label: "Create new Bitlink if not found?",
      description:
        "Create a new bitlink if no record is found for the specified bitlink.",
      type: "string",
      options: ["Yes", "No"],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.createBitlinkIfNotFound === "Yes") {
      props["long_url"] = {
        type: "string",
        label: "Long url",
        description: "This is the url to be shortened",
      };
      props["title"] = {
        type: "string",
        optional: true,
        label: "Bitlink title",
      };
      props["tags"] = {
        type: "string[]",
        optional: true,
        label: "Tags",
        description: "This is an array of strings",
      };
      props["domain"] = {
        type: "string",
        label: "Domain",
        description:
          "Bitlinks that contain deeplinks configured with a custom domain",
        optional: true,
      };
      props["group_guid"] = {
        type: "string",
        optional: true,
        label: "Group guid",
      };
      props["deeplinks"] = {
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
      const updatedDeepLink = formatArrayStrings(
        deeplinks,
        constants.ALLOWED_DEEPLINK_KEYS,
        "deeplinks"
      );

      tags?.length && (payload.tags = tags);
      updatedDeepLink?.length && (payload.deeplinks = updatedDeepLink);

      const response = await this.bitly.createBitlink(payload);
      response && $.export("$summary", "Bitlink created successfully");
      return response;
    }
    return bitlinkDetail;
  },
};
