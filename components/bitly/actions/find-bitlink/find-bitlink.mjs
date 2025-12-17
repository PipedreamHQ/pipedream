import { ConfigurationError } from "@pipedream/platform";
import { formatArrayStrings } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";
import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-find-bitlink",
  name: "Retrieve a Bitlink",
  description:
    "Finds an existing Bitlink in your account. Optionally, creates one if none are found.  [See the docs here](https://dev.bitly.com/api-reference#expandBitlink)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bitly,
    bitlink: {
      type: "string",
      label: "Bitlink url",
      description: "This is the shortened url",
    },
    createBitlinkIfNotFound: {
      label: "Create new Bitlink if not found?",
      description:
        "Create a new bitlink if no record is found for the specified bitlink.",
      type: "boolean",
      default: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {
      longUrl: {
        type: "string",
        label: "Long url",
        description: "This is the url to be shortened",
      },
      title: {
        type: "string",
        optional: true,
        label: "Bitlink title",
      },
      tags: {
        type: "string[]",
        optional: true,
        label: "Tags",
        description: "This is an array of strings",
      },
      domain: {
        type: "string",
        label: "Domain",
        description:
          "Bitlinks that contain deeplinks configured with a custom domain",
        optional: true,
      },
      groupGuid: {
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
    };
    return this.createBitlinkIfNotFound && props;
  },
  async run({ $ }) {
    let bitlinkDetail;
    const {
      domain,
      title,
      tags,
      createBitlinkIfNotFound,
      deeplinks,
    } = this;
    try {
      bitlinkDetail = await this.bitly.getBitlink(this.bitlink);
    } catch (error) {
      if (createBitlinkIfNotFound) {
        $.export("$summary", "Bitlink not found. Creating new Bitlink");
      } else {
        throw new ConfigurationError("Bitlink not found");
      }
    }

    if (!bitlinkDetail && createBitlinkIfNotFound) {
      const payload = {
        long_url: this.longUrl,
        domain,
        group_guid: this.groupGuid,
        title,
      };
      const updatedDeepLink = formatArrayStrings(
        deeplinks,
        constants.ALLOWED_DEEPLINK_KEYS,
        "deeplinks",
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
