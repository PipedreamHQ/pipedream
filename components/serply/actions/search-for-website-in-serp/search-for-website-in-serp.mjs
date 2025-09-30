import serply from "../../serply.app.mjs";

export default {
  key: "serply-search-for-website-in-serp",
  name: "Search for Website in SERP (Search Engine Results Pages)",
  description: "Performs a Google Search and searches for a website in Search Engine Results Pages (SERP). [See the documentation](https://serply.io/docs/operations/v1/serp)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    serply,
    query: {
      propDefinition: [
        serply,
        "query",
      ],
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website to search in. Either `Website` or `Domain` must be provided.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain to search in. Either `Domain` or `Website` must be provided.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      query, website, domain,
    } = this;
    const response = await this.serply.searchSerp({
      $,
      query: encodeURIComponent(query),
      website: website && encodeURIComponent(website),
      domain: domain && encodeURIComponent(domain),
    });

    $.export("$summary", "Successfully performed SERP search");
    return response;
  },
};
