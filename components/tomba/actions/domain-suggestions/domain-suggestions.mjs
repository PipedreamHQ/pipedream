import app from "../../tomba.app.mjs";

export default {
  key: "tomba-domain-suggestions",
  name: "Suggest Domains",
  description:
    "Retrieve a list of suggested domains similar to or related to your search query. This helps discover competitors, similar companies, and related businesses for market research and prospecting. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
      description: "The domain or company name to find suggestions for",
    },
  },
  async run({ $ }) {
    const response = await this.app.suggestDomains({
      $,
      query: this.query,
    });

    $.export(
      "$summary",
      `Successfully found domain suggestions for: ${this.query}`,
    );
    return response;
  },
};
