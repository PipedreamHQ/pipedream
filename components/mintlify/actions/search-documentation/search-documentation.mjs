import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-search-documentation",
  name: "Search Documentation",
  description: "Perform semantic and keyword searches across your documentation. [See the documentation](https://www.mintlify.com/docs/api-reference/assistant/search)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mintlify,
    domain: {
      propDefinition: [
        mintlify,
        "domain",
      ],
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "The search query to execute against your documentation content",
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of search results to return. Defaults to 10 if not specified",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "Filter results by documentation version",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Filter results by content language",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.searchDocumentation({
      $,
      domain: this.domain,
      data: {
        query: this.query,
        pageSize: this.pageSize,
        filter: this.version || this.language
          ? {
            version: this.version,
            language: this.language,
          }
          : undefined,
      },
    });

    $.export("$summary", `Found ${response.length} results`);
    return response;
  },
};
