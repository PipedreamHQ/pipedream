// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-get-user-feedback",
  name: "Get User Feedback",
  description: "Pull user feedback submitted on your documentation pages, including comments, helpfulness ratings, and code snippet reports. Pass the response's `nextCursor` back into `Cursor` to fetch the next page. Limited to 100 requests per organization per hour, shared across all analytics endpoints. [See the documentation](https://www.mintlify.com/docs/api-reference/analytics/feedback)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mintlify,
    dateFrom: {
      propDefinition: [
        mintlify,
        "dateFrom",
      ],
    },
    dateTo: {
      propDefinition: [
        mintlify,
        "dateTo",
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "Filter by where the feedback was submitted from.",
      optional: true,
      options: [
        "code_snippet",
        "contextual",
        "agent",
        "thumbs_only",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Comma-separated statuses to filter by: `pending`, `in_progress`, `resolved`, `dismissed`. Omit to include all.",
      optional: true,
    },
    limit: {
      propDefinition: [
        mintlify,
        "limit",
      ],
      description: "Maximum number of results to return per page, 1-100. Defaults to 50.",
    },
    cursor: {
      propDefinition: [
        mintlify,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.getUserFeedback({
      $,
      params: {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        source: this.source,
        status: this.status,
        limit: this.limit,
        cursor: this.cursor,
      },
    });

    $.export("$summary", `Retrieved ${response.feedback?.length} feedback item(s)`);

    return response;
  },
};
