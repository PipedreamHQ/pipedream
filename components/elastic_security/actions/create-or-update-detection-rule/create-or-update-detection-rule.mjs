// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import elasticSecurity from "../../elastic_security.app.mjs";
import {
  RULE_TYPES, RULE_READ_ONLY_FIELDS,
} from "../../common/constants.mjs";

export default {
  key: "elastic_security-create-or-update-detection-rule",
  name: "Create or Update Detection Rule",
  description: "Create a new Elastic Security detection rule via POST /api/detection_engine/rules, or full-replace update an existing one when `id` or `ruleId` is provided, via PUT /api/detection_engine/rules."
    + " On update, the tool first fetches the rule's current definition and merges your supplied fields into it, so you only need to pass the fields you want to change — Kibana's underlying PUT still requires the full definition, but this tool handles that for you."
    + " Run **Find Detection Rules** first to obtain an `id`/`ruleId` for updates."
    + " `name`, `description`, `riskScore`, `severity`, and `type` are required when creating (no `id`/`ruleId`)."
    + " For `type: threshold` rules, set `threshold`. For `type: threat_match` rules, set `threatIndex` and `threatMapping`. Use `additionalFields` as an escape hatch for any other type-specific fields (e.g. `anomaly_threshold` for `machine_learning` rules)."
    + " Example: calling with `name: \"Suspicious PowerShell\"`, `description: \"...\"`, `riskScore: 60`, `severity: \"high\"`, `type: \"query\"`, `query: \"process.name: powershell.exe\"` returns `{ id: \"7ac3...\", rule_id: \"f3bb...\", name: \"Suspicious PowerShell\", enabled: true, ... }`; calling again with that `id` and `riskScore: 80` returns the same rule with only the risk score changed."
    + " [See the create documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-createrule) and the [update documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-updaterule)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    id: {
      propDefinition: [
        elasticSecurity,
        "id",
      ],
      description: "The Kibana internal UUID of an existing rule to update. Omit this and `ruleId` to create a new rule instead. Run **Find Detection Rules** first to obtain valid IDs.",
      optional: true,
    },
    ruleId: {
      propDefinition: [
        elasticSecurity,
        "ruleId",
      ],
      description: "When updating: the user-defined `rule_id` of an existing rule (alternative to `id`). When creating: an optional custom `rule_id` to assign to the new rule — if omitted on create, Kibana generates one.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Human-readable rule name (e.g. `Suspicious PowerShell Execution`). Required when creating.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of what the rule detects. Required when creating.",
      optional: true,
    },
    riskScore: {
      type: "integer",
      label: "Risk Score",
      description: "Risk score from 0 to 100. Required when creating.",
      optional: true,
      min: 0,
      max: 100,
    },
    severity: {
      propDefinition: [
        elasticSecurity,
        "severity",
      ],
      description: "Rule severity. One of: `low`, `medium`, `high`, `critical`. Required when creating.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Rule type discriminator. One of: `query`, `eql`, `saved_query`, `threshold`, `threat_match`, `machine_learning`, `new_terms`, `esql`. Required when creating. Cannot be changed on update.",
      optional: true,
      options: RULE_TYPES,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Detection query in KQL or Lucene (required for `query`/`saved_query`/`eql` style rules), e.g. `process.name: powershell.exe`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Query language: `kuery` or `lucene`.",
      optional: true,
      options: [
        "kuery",
        "lucene",
      ],
    },
    index: {
      type: "string[]",
      label: "Index Patterns",
      description: "Index patterns the rule runs against (e.g. `logs-*`, `winlogbeat-*`).",
      optional: true,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Whether the rule is enabled. Defaults to `true` on create.",
      optional: true,
    },
    tags: {
      propDefinition: [
        elasticSecurity,
        "tags",
      ],
      description: "Tags to apply to the rule. Run **List Tags** first to reuse existing tags instead of creating near-duplicates. On update, this replaces the rule's existing tag set entirely.",
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "How often the rule runs, as date-math (e.g. `5m`). Defaults to `5m` on create.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "Start of the rule's lookback window as date-math (e.g. `now-6m`). Defaults to `now-6m` on create.",
      optional: true,
    },
    maxSignals: {
      type: "integer",
      label: "Max Signals",
      description: "Maximum number of alerts the rule can create per run. Minimum 1, maximum 1000. Defaults to 100 on create.",
      optional: true,
      min: 1,
      max: 1000,
    },
    threshold: {
      type: "object",
      label: "Threshold",
      description: "Threshold configuration, required for `type: threshold` rules. Example: `{\"field\":[\"host.name\"],\"value\":5}` fires when 5+ matching events share the same `host.name`.",
      optional: true,
    },
    threatIndex: {
      type: "string[]",
      label: "Threat Index",
      description: "Index patterns containing threat intelligence indicators, required for `type: threat_match` rules. Example: `[\"logs-ti_*\"]`.",
      optional: true,
    },
    threatMapping: {
      type: "object",
      label: "Threat Mapping",
      description: "A single threat-match group, required for `type: threat_match` rules. Shape: `{\"entries\":[{\"field\":\"source.ip\",\"type\":\"mapping\",\"value\":\"threat.indicator.ip\"}]}`, matching a local event field against a threat indicator field. For multiple match groups, use `additionalFields.threat_mapping` (an array of these objects) instead.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional rule fields to merge into the request body, for type-specific configuration not covered by other parameters (e.g. `{\"anomaly_threshold\":50,\"machine_learning_job_id\":[\"job-1\"]}` for `machine_learning` rules).",
      optional: true,
    },
  },
  async run({ $ }) {
    const suppliedFields = {
      name: this.name,
      description: this.description,
      risk_score: this.riskScore,
      severity: this.severity,
      type: this.type,
      query: this.query,
      language: this.language,
      index: this.index,
      enabled: this.enabled,
      tags: this.tags,
      interval: this.interval,
      from: this.from,
      max_signals: this.maxSignals,
      threshold: this.threshold,
      threat_index: this.threatIndex,
      threat_mapping: this.threatMapping && [
        this.threatMapping,
      ],
      ...this.additionalFields,
    };
    const cleanFields = Object.fromEntries(
      Object.entries(suppliedFields).filter(([
        , value,
      ]) => value !== undefined),
    );

    if (!this.id && !this.ruleId) {
      const missingRequired = !this.name || !this.description || this.riskScore === undefined
        || !this.severity || !this.type;
      if (missingRequired) {
        throw new ConfigurationError("`name`, `description`, `riskScore`, `severity`, and `type` are required when creating a new rule (no `id`/`ruleId` provided).");
      }
      const response = await this.elasticSecurity.createDetectionRule({
        $,
        data: {
          rule_id: this.ruleId,
          ...cleanFields,
        },
      });
      $.export("$summary", `Created detection rule "${response.name}" (${response.id})`);
      return response;
    }

    const current = await this.elasticSecurity.getDetectionRule({
      $,
      params: {
        id: this.id,
        rule_id: this.ruleId,
      },
    });
    const merged = {
      ...current,
      ...cleanFields,
    };
    // Kibana's PUT rejects a body carrying both `id` and `rule_id` — the GET response always
    // includes both, so keep only `id` (always present) to identify the rule being updated.
    delete merged.rule_id;
    for (const field of RULE_READ_ONLY_FIELDS) {
      delete merged[field];
    }
    const response = await this.elasticSecurity.updateDetectionRule({
      $,
      data: merged,
    });
    $.export("$summary", `Updated detection rule "${response.name}" (${response.id})`);
    return response;
  },
};
