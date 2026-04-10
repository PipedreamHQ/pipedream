export default {
  key: "docuwriter_ai-list-generations",
  name: "List Generations",
  description: "List your documentation generations with optional filtering. No credit cost. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92060)",
  version: "0.0.2",
  type: "action",
  props: {
    docuwriter_ai: {
      type: "app",
      app: "docuwriter_ai",
    },
    type: {
      type: "string",
      label: "Generation Type",
      description: "Filter by generation type",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter by archived status",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of results per page (1-100)",
      optional: true,
      min: 1,
      max: 100,
    },
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  async run({ $ }) {
    const params = {};
    if (this.type) params.type = this.type;
    if (this.archived !== undefined) params.archived = this.archived;
    if (this.perPage) params.per_page = this.perPage;

    const response = await this.docuwriter_ai.listGenerations($, params);
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Retrieved ${count} generation(s)`);
    return response;
  },
};
