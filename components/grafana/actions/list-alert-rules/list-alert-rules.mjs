// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-list-alert-rules",
  name: "List Alert Rules",
  description:
    "List all alert rules with their current state (firing,"
    + " normal, pending, inactive)."
    + " Returns rule definitions including conditions, labels,"
    + " and annotations."
    + " Use this to answer questions like 'what alerts are"
    + " firing?' or 'what alerts exist for service X?'",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    grafana,
  },
  async run({ $ }) {
    const rules = await this.grafana.getAlertRules($);

    const count = Array.isArray(rules)
      ? rules.length
      : 0;

    $.export(
      "$summary",
      `Found ${count} alert rule${count === 1
        ? ""
        : "s"}`,
    );

    return rules;
  },
};
