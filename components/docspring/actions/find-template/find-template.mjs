import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-find-template",
  name: "Find Template",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find templates by name or ID. [See the documentation](https://docspring.com/docs).",
  type: "action",
  props: {
    docspring,
    query: {
      type: "string",
      label: "Query",
      description: "Filter templates by name or ID.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of templates to return.",
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = this.maxResults || 20;
    const results = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const params = { per_page: 50, page };
      if (this.query) params.query = this.query;
      const batch = await this.docspring.listTemplates({ $, params });
      const list = Array.isArray(batch) ? batch : [];
      results.push(...list);
      hasMore = list.length >= 50 && results.length < limit;
      page += 1;
    }
    const out = results.slice(0, limit);
    $.export("$summary", `Found ${out.length} template(s)`);
    return out;
  },
};
