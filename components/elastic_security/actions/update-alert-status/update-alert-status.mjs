// x-pd-ai: optimized
import elasticSecurity from "../../elastic_security.app.mjs";
import { ALERT_STATUSES } from "../../common/constants.mjs";

export default {
  key: "elastic_security-update-alert-status",
  name: "Update Alert Status",
  description: "Set the workflow status of one or more Elastic Security alerts (signals) by ID via POST /api/detection_engine/signals/status."
    + " Run **Search Alerts** first to obtain signal IDs."
    + " Example: calling with `alertStatus: \"closed\"`, `signalIds: [\"abc123\"]`, `reason: \"false_positive\"` returns `{ updated: 1, version_conflicts: 0 }`."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-setalertsstatus)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    alertStatus: {
      type: "string",
      label: "Alert Status",
      description: "New alert status. One of: `open`, `acknowledged`, `closed`. This is the alert's own workflow status, distinct from a case's status.",
      options: ALERT_STATUSES,
    },
    signalIds: {
      type: "string[]",
      label: "Signal IDs",
      description: "Signal (alert) IDs to update; at least one required. Run **Search Alerts** first to obtain IDs (the `_id` field of each hit). Mapped to the API field `signal_ids`.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Optional reason for the status change (e.g. `false_positive`, `duplicate`, `true_positive`, `benign_positive`, `automated_closure`, `other`, or a custom string).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.elasticSecurity.updateAlertStatus({
      $,
      data: {
        status: this.alertStatus,
        signal_ids: this.signalIds,
        reason: this.reason,
      },
    });
    $.export("$summary", `Updated ${this.signalIds.length} alert(s) to status "${this.alertStatus}"`);
    return response;
  },
};
