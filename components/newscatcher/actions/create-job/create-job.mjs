import newscatcher from "../../newscatcher.app.mjs";

export default {
  key: "newscatcher-create-job",
  name: "Create Job",
  description: "Create a new job in Newscatcher. [See the documentation](https://www.newscatcherapi.com/docs/web-search-api/api-reference/jobs/create-job)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    newscatcher,
    query: {
      type: "string",
      label: "Query",
      description: "Natural language question describing what to find. Example: `AI company acquisitions`",
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "Template string to guide record summary formatting. Use placeholder syntax with brackets to indicate desired fields: [COMPANY], [REVENUE], [TARGET], [AMOUNT], etc. Example: `[ACQUIRER] acquired [TARGET] for [AMOUNT]`",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "Additional context to focus on specific aspects of your query. Example: `Focus on deal size and acquiring company details`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start of date range for article search (ISO 8601 format with UTC timezone). Must be within plan's allowed lookback period. Default is 5 days before current date if not specified. Example: `2026-01-30T00:00:00Z`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End of date range for article search (ISO 8601 format with UTC timezone). Must be within plan's allowed lookback period. Default is current date if not specified. Example: `2026-02-16T00:00:00Z`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return. If not specified, defaults to your plan limit.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.newscatcher.createJob({
      $,
      data: {
        query: this.query,
        schema: this.schema,
        context: this.context,
        start_date: this.startDate,
        end_date: this.endDate,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully created job with ID ${response.job_id}`);
    return response;
  },
};
