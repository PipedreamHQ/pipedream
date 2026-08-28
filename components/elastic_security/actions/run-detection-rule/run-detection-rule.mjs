// x-pd-ai: optimized
import elasticSecurity from "../../elastic_security.app.mjs";
import { BULK_ACTION_RUN } from "../../common/constants.mjs";
import { getDefaultRunWindow } from "../../common/utils.mjs";

export default {
  key: "elastic_security-run-detection-rule",
  name: "Run Detection Rule",
  description: "Manually run one or more Elastic Security detection rules over a time range via POST /api/detection_engine/rules/_bulk_action (bulk action `run`)."
    + " Use this to test a rule immediately instead of waiting for its next scheduled interval, or to backfill detections over a past window."
    + " Provide the rule ids to execute. Run **Find Detection Rules** first to obtain valid ids."
    + " Defaults to roughly the last hour if not specified: `endDate` defaults to one minute ago (a small buffer so clock skew/latency can't push it into the future, which Kibana rejects), and `startDate` defaults to one hour before that."
    + " Note: Kibana rejects manual runs against disabled rules — the rule must have `enabled: true` (see **Create or Update Detection Rule**)."
    + " Example: calling with `ids: [\"7ac3...\"]` and no dates returns `{ attributes: { results: { created: [{ id: \"7ac3...\", name: \"...\" }] }, summary: { succeeded: 1, failed: 0 } } }`."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-performrulesbulkaction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    ids: {
      type: "string[]",
      label: "Rule IDs",
      description: "Kibana rule UUIDs to run. At least one required. Run **Find Detection Rules** first to obtain valid IDs.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start of the manual run time range as an ISO 8601 timestamp (e.g. `2026-08-27T00:00:00.000Z`). If omitted, defaults to one hour before the resolved `endDate` (i.e. one hour and one minute before now, when `endDate` is also omitted).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End of the manual run time range as an ISO 8601 timestamp (e.g. `2026-08-27T01:00:00.000Z`). Defaults to one minute ago, not the exact current time — this buffer keeps the request from landing in the future on Kibana's server clock.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      startDate, endDate,
    } = getDefaultRunWindow({
      startDate: this.startDate,
      endDate: this.endDate,
    });
    const response = await this.elasticSecurity.runDetectionRules({
      $,
      data: {
        action: BULK_ACTION_RUN,
        ids: this.ids,
        run: {
          start_date: startDate,
          end_date: endDate,
        },
      },
    });
    const succeeded = response?.attributes?.summary?.succeeded;
    const failed = response?.attributes?.summary?.failed;
    const summary = succeeded === undefined
      ? `Manually triggered ${this.ids.length} detection rule(s)`
      : `Manually triggered ${succeeded} detection rule(s)${failed
        ? `, ${failed} failed`
        : ""}`;
    $.export("$summary", summary);
    return response;
  },
};
