import app from "../../keenable.app.mjs";

export default {
  key: "keenable-search",
  name: "Search",
  description: "Search the web with Keenable and get ranked results with title, URL, snippet and dates. [See the documentation](https://docs.keenable.ai)",
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
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "`pro` (default) returns higher-quality results. `realtime` is the fastest mode, for latency-sensitive workflows.",
      options: [
        "pro",
        "realtime",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return (1-50). Defaults to 10.",
      min: 1,
      max: 50,
      optional: true,
    },
    site: {
      type: "string",
      label: "Site",
      description: "Restrict results to a specific domain, e.g. `github.com`",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "Never return results from these hosts. Each entry also covers its subdomains, e.g. `yahoo.com`",
      optional: true,
    },
    publishedAfter: {
      type: "string",
      label: "Published After",
      description: "Only return pages published after this date (`YYYY-MM-DD`, ISO 8601, or relative like `7d`)",
      optional: true,
    },
    publishedBefore: {
      type: "string",
      label: "Published Before",
      description: "Only return pages published before this date (`YYYY-MM-DD` or ISO 8601)",
      optional: true,
    },
    snippetMaxLength: {
      type: "integer",
      label: "Snippet Max Length",
      description: "Maximum length, in characters, of the snippet returned per result (180-10000)",
      min: 180,
      max: 10000,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.search({
      $,
      data: {
        query: this.query,
        mode: this.mode,
        max_results: this.maxResults,
        site: this.site,
        exclude_domains: this.excludeDomains,
        published_after: this.publishedAfter,
        published_before: this.publishedBefore,
        snippet_max_length: this.snippetMaxLength,
      },
    });
    const count = response.results?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} result${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
