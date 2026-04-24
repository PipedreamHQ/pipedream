import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-list-generations",
  name: "List Generations",
  description: "List your documentation generations with optional filtering. No credit cost. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92060)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docuwriterAi,
    type: {
      type: "string",
      label: "Generation Type",
      description: "Filter by generation type (e.g., documentation, tests)",
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
  async run({ $ }) {
    const response = await this.docuwriterAi.listGenerations($, {
      type: this.type,
      archived: this.archived,
      per_page: this.perPage,
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Retrieved ${count} generation(s)`);
    return response;
  },
};
