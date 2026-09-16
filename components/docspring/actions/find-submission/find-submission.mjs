import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-find-submission",
  name: "Find Submission",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description:
    "Get a submission by ID, or list recent submissions filtered by mode and date. [See the documentation](https://docspring.com/docs).",
  type: "action",
  props: {
    docspring,
    submissionId: {
      type: "string",
      label: "Submission ID",
      description: "Look up a specific submission (`sub_...`). Leave blank to list recent submissions.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Mode",
      description: "Only return submissions in this mode: `live` or `test`. Leave blank for both.",
      options: [
        "live",
        "test",
      ],
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only return submissions created after this ISO 8601 timestamp (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only return submissions created before this ISO 8601 timestamp (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of submissions to return. Must be a positive integer (defaults to `20`).",
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.submissionId) {
      const submission = await this.docspring.getSubmission({ $, submissionId: this.submissionId });
      $.export("$summary", `Found submission \`${this.submissionId}\``);
      return submission;
    }
    const limit = Number.isInteger(this.maxResults) && this.maxResults > 0
      ? this.maxResults
      : 20;
    const results = [];
    let cursor;
    do {
      const params = { limit: 50, include_data: true };
      if (this.type) params.type = this.type;
      if (this.createdAfter) params.created_after = this.createdAfter;
      if (this.createdBefore) params.created_before = this.createdBefore;
      if (cursor) params.cursor = cursor;
      const pageData = await this.docspring.listSubmissions({ $, params });
      const subs = pageData.submissions || [];
      results.push(...subs);
      cursor = pageData.next_cursor;
      if (!subs.length) break;
    } while (cursor && results.length < limit);
    const out = results.slice(0, limit);
    $.export("$summary", `Found ${out.length} submission(s)`);
    return out;
  },
};
