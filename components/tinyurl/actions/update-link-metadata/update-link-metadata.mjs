import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-update-link-metadata",
  name: "Update Link Metadata",
  description: "Updates the metadata of an existing TinyURL. [See the documentation]()",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tinyurl,
    domain: {
      propDefinition: [
        tinyurl,
        "domain",
      ],
    },
    urls: {
      propDefinition: [
        tinyurl,
        "urls",
        ({ domain }) => ({
          domain,
        }),
      ],
    },
    newDomain: {
      type: "string",
      label: "New Domain",
      description: "The new domain you would like to switch to",
      optional: true,
    },
    newAlias: {
      type: "string",
      label: "New Alias",
      description: "The new alias you would like to switch to",
      optional: true,
    },
    newStats: {
      type: "boolean",
      label: "New Stats",
      description: "Turns on/off the collection of click analytics",
      optional: true,
    },
    newTags: {
      type: "string[]",
      label: "New Tags",
      description: "Tags you would like this TinyURL to have. Overwrites the existing tags. **Paid accounts only**",
      optional: true,
    },
    newExpiresAt: {
      type: "string",
      label: "New Expires At",
      description: "TinyURL expiration in ISO8601 format. If not set so TinyURL never expires, **Paid accounts only**",
      optional: true,
    },
    newDescription: {
      type: "string",
      label: "New Description",
      description: "The new description",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.tinyurl.updateTinyURLMetadata({
        $,
        data: {
          domain: this.domain,
          alias: this.urls,
          new_domain: this.newDomain,
          new_alias: this.newAlias,
          new_stats: this.newStats,
          new_tags: parseObject(this.newTags),
          new_expires_at: this.newExpiresAt,
          new_description: this.newDescription,
        },
      });
      $.export("$summary", `Updated TinyURL metadata for link: ${response.data.tiny_url}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.errors[0]);
    }
  },
};
