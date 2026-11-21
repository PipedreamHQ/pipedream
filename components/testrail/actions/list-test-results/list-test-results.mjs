import app from "../../testrail.app.mjs";
import {
  joinIds, nonNullCustomFields, toIso,
} from "../../common/utils.mjs";

export default {
  key: "testrail-list-test-results",
  name: "List Test Results",
  description: "Lists the results recorded on one TestRail test, newest first. Use it to see why a test failed (the tester's comment), which defects are linked and how the status changed over time. Not for listing the tests of a run (use **List Tests**) or for recording a result (use **Add Result**). Returns each result's id, status_id, comment, defects, version, elapsed, created_on (ISO-8601), created_by and any filled-in custom result fields; defaults to the 20 most recent. Example: testId=4124 → `[{id: 9, status_id: 5, comment: \"Fence did not trip at 10kV; relay timeout 4s\"}]`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Only return results with one of these status IDs (1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed by default; see **Get Statuses**). Leave empty for all. Example: `[5]`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const {
      items, has_more, next_offset,
    } = await this.app.paginate({
      $,
      path: `get_results/${this.testId}`,
      key: "results",
      params: {
        status_id: joinIds(this.statusIds),
      },
      maxResults: this.maxResults ?? 20,
      offset: this.offset,
    });
    const results = items.map((r) => ({
      id: r.id,
      test_id: r.test_id,
      status_id: r.status_id,
      comment: r.comment,
      defects: r.defects,
      version: r.version,
      elapsed: r.elapsed,
      created_on: toIso(r.created_on),
      created_by: r.created_by,
      ...nonNullCustomFields(r),
    }));
    $.export("$summary", `Found ${results.length} result(s) for test ${this.testId}`);
    return {
      results,
      has_more,
      next_offset,
    };
  },
};
