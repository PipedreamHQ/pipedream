import explorium from "../../explorium.app.mjs";

export default {
  key: "explorium-match-business-id",
  name: "Match Business ID",
  description: "Match a businesse to its unique identifier using business name and domain. [See the documentation](https://developers.explorium.ai/reference/match_businesses)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    explorium,
    name: {
      type: "string",
      label: "Business Name",
      description: "The name of the business to match",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the business to match",
    },
  },
  async run({ $ }) {
    const response = await this.explorium.matchBusinessId({
      $,
      data: {
        businesses_to_match: [
          {
            name: this.name,
            domain: this.domain,
          },
        ],
      },
    });
    $.export("$summary", `Matched business ID for ${this.name} (${this.domain})`);
    return response;
  },
};
