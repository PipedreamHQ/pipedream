import app from "../../builtwith.app.mjs";

export default {
  key: "builtwith-get-domain-relationships",
  name: "Get Domain Relationships",
  description: "Get the relationships of a domain with other websites. [See the documentation](https://api.builtwith.com/relationships-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getWebsiteRelationships({
      $,
      params: {
        LOOKUP: this.domain,
      },
    });

    if (response.Errors.length) {
      throw new Error(response.Errors[0].Message);
    }

    if (response.Relationships.length) {
      $.export("$summary", `Retrieved relationships for domain ${this.domain}`);
    }

    return response;
  },
};
