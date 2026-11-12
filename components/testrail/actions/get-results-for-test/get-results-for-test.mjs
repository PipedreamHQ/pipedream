import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "status_id",
  "comment",
  "defects",
  "version",
  "elapsed",
  "created_by",
  "created_on",
  "assignedto_id",
];

export default {
  key: "testrail-get-results-for-test",
  name: "Get Results For Test",
  description: "Get the result history of one TestRail test, newest first: status, the comment (usually the failure reason), linked defects, version, elapsed time, who recorded it and when."
    + " Use after **List Tests** or **Get Test** to learn why a test failed or what was already triaged, before recording a new result with **Add Result**. `results[0]` is the current state."
    + " Takes a test id (per run), not a case id. Optional `statusIds` (ids or labels like \"Failed\") filters the history; default `limit` is 10 (max 250)."
    + " Example: testId=3659 → returns `{ total: 1, results: [{ id: 155, status_id: 5, comment: \"Backup generator did not engage within 30s\", defects: null, created_on: 1794465337 }] }`. Timestamps are unix seconds."
    + " Pass `fields` to change the returned fields (`id` is always included; custom result fields are named `custom_*`)."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312660-Results)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    testId: {
      propDefinition: [
        app,
        "testId",
      ],
    },
    statusIds: {
      type: "string[]",
      label: "Statuses",
      description: "Only results with these statuses. Status ids or labels, e.g. `[\"Failed\"]`. Omit for all.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum results to return (default 10, max 250).",
      optional: true,
      min: 1,
      max: 250,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Result fields to return (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const statusIds = this.statusIds?.length
      ? await Promise.all(this.statusIds.map((s) => this.app.resolveStatusId(s)))
      : undefined;
    const {
      items, truncated,
    } = await this.app.paginate({
      endpoint: `get_results/${this.testId}`,
      params: {
        status_id: utils.csv(statusIds),
      },
      collection: "results",
      limit: Math.min(this.limit || 10, 250),
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const results = items.map((result) => utils.pluck(result, fields));
    $.export("$summary", `Found ${results.length} result${results.length === 1
      ? ""
      : "s"} for test ${this.testId}`);
    return {
      total: results.length,
      truncated,
      results,
    };
  },
};
