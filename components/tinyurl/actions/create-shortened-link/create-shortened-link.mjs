import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-create-shortened-link",
  name: "Create Shortened Link",
  description: "Creates a new shortened link. [See the documentation]()",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tinyurl,
    url: {
      propDefinition: [
        tinyurl,
        "url",
      ],
    },
    domain: {
      propDefinition: [
        tinyurl,
        "domain",
      ],
      optional: true,
    },
    alias: {
      propDefinition: [
        tinyurl,
        "alias",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        tinyurl,
        "tags",
      ],
      optional: true,
    },
    expiresAt: {
      propDefinition: [
        tinyurl,
        "expiresAt",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The alias description",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.tinyurl.createTinyURL({
        $,
        data: {
          url: this.url,
          domain: this.domain,
          alias: this.alias,
          tags: parseObject(this.tags)?.join(","),
          expires_at: this.expiresAt,
          description: this.description,
        },
      });
      $.export("$summary", `Created TinyURL: ${response.data.tiny_url}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.errors[0]);
    }
  },
};

