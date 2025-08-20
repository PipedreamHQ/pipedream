import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-search-content",
  name: "Search Content",
  description: "Searches for content using the Confluence Query Language (CQL). [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-search#api-wiki-rest-api-search-get)",
  version: "0.0.3",
  type: "action",
  props: {
    confluence,
    cql: {
      type: "string",
      label: "CQL",
      description: "The CQL query to be used for the search. See [Advanced Searching using CQL](https://developer.atlassian.com/cloud/confluence/advanced-searching-using-cql/) for instructions on how to build a CQL query.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  methods: {
    searchContent({
      cloudId, ...opts
    }) {
      return this.confluence._makeRequest({
        url: `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/rest/api/search`,
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });
    const items = this.confluence.paginate({
      resourceFn: this.searchContent,
      args: {
        $,
        cloudId,
        params: {
          cql: this.cql,
        },
      },
      max: this.maxResults,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }

    $.export("$summary", `Successfully found ${results.length} result${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
