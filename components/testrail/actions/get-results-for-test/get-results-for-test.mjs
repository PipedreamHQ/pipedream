import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "status_id",
  "comment",
  "defects",
  "created_on",
  "created_by",
  "elapsed",
  "version",
  "assignedto_id",
];

export default {
  key: "testrail-get-results-for-test",
  name: "Get Results for Test",
  description: "Get the result history of one TestRail test, newest first: each result's status, comment (usually the failure message), linked defects, who recorded it and when. Use it to find out why a test failed or how its status changed over time; the latest result (first item) is the test's current status. Get the test ID from **List Tests**; record a new verdict with **Add Result**. Example: to see why test 98765 failed, call with testId=98765, limit=3 → returns the three latest results with status_id, comment, defects, created_on. Common mistake: passing a case ID instead of a test ID. Returns at most 250 results by default (hard cap 1000). [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312404-Results)",
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
      type: "integer[]",
      label: "Status IDs",
      description: "Only results with one of these status IDs, e.g. `[5]` for Failed. Omit for all. Check **Get Metadata** (resource `statuses`).",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: `Field names to return per result (\`id\` is always included). Defaults to: ${DEFAULT_FIELDS.join(", ")}. Other available: test_id, assignedto_id, custom_* result fields (see **Get Metadata** resource \`result_fields\`).`,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.statusIds?.length) {
      params.status_id = this.statusIds.join(",");
    }
    const {
      items, hasMore,
    } = await this.app.paginate({
      $,
      path: `get_results/${this.testId}`,
      resourceKey: "results",
      params,
      max: this.limit,
    });
    const results = utils.selectFields(items, this.fields, DEFAULT_FIELDS);
    $.export("$summary", `Found ${results.length} result${results.length === 1
      ? ""
      : "s"} for test ${this.testId}`);
    return {
      results,
      has_more: hasMore,
    };
  },
};
