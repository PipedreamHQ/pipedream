// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import elasticSecurity from "../../elastic_security.app.mjs";
import {
  RULE_TYPES, RULE_READ_ONLY_FIELDS,
} from "../../common/constants.mjs";

export default {
  key: "elastic_security-create-or-update-detection-rule",
  name: "Create or Update Detection Rule",
  description: "Create a new Elastic Security detection rule via POST /api/detection_engine/rules, or full-replace update an existing one when `id` is provided, via PUT /api/detection_engine/rules."
    + " On update, the tool first fetches the rule's current definition and merges your supplied fields into it, so you only need to pass the fields you want to change — Kibana's underlying PUT still requires the full definition, but this tool handles that for you."
    + " Run **Find Detection Rules** first to obtain the `id` for updates (it also accepts `ruleId` if that's all you have)."
    + " `name`, `description`, `riskScore`, `severity`, and `type` are required when creating (no `id`); optionally set `ruleId` on create to assign a custom `rule_id` instead of letting Kibana generate one."
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
      description: "The Kibana internal UUID of an existing rule to update (e.g. `7ac3c66d-f0b4-4f7c-a576-7bb91bf4e9ce`). This is the sole trigger for update mode — omit it to create a new rule. Run **Find Detection Rules** first to obtain valid IDs (it accepts either `id` or `ruleId` for lookup).",
      optional: true,
    },
    ruleId: {
      propDefinition: [
        elasticSecurity,
        "ruleId",
      ],
      description: "When creating (no `id`): an optional custom `rule_id` to assign to the new rule, e.g. `my-custom-rule-id` — if omitted, Kibana generates one. Not used to identify a rule for update; use `id` for that (run **Find Detection Rules** with `ruleId` first if that's all you have, to get its `id`).",
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
      description: "Additional rule fields to merge into the request body, for type-specific configuration not covered by other parameters (e.g. `{\"anomaly_threshold\":50,\"machine_learning_job_id\":[\"job-1\"]}` for `machine_learning` rules, or `threat_mapping` as an array for multi-group `threat_match` rules, since `threatMapping` only supports one group). `id`, `rule_id`, and `type` here are always ignored — use the dedicated `type` parameter instead. Read-only fields (`created_at`, `updated_at`, `revision`, etc.) are also always ignored, even though they have no dedicated parameter of their own. Any other key here is ignored if you've also set its dedicated parameter (that value wins); otherwise it's used as given.",
      optional: true,
    },
  },
  async run({ $ }) {
    const namedFields = {
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
    };
    const suppliedNamedFields = Object.fromEntries(
      Object.entries(namedFields).filter(([
        , value,
      ]) => value !== undefined),
    );
    // additionalFields is a free-form escape hatch. A field the caller actually supplied via a
    // dedicated prop always wins over it (e.g. threshold). `id`/`rule_id`/`type` and read-only
    // fields are protected even when unset — silently accepting them from additionalFields would
    // let a caller change a rule's identity or type without going through the validated props.
    // Everything else (e.g. `threat_mapping` for multi-group threat_match rules) can flow through
    // additionalFields when its dedicated prop isn't used, per this tool's documented escape hatch.
    const alwaysProtectedKeys = new Set([
      "id",
      "rule_id",
      "type",
      ...RULE_READ_ONLY_FIELDS,
    ]);
    const protectedKeys = new Set([
      ...alwaysProtectedKeys,
      ...Object.keys(suppliedNamedFields),
    ]);
    const safeAdditionalFields = Object.fromEntries(
      Object.entries(this.additionalFields ?? {}).filter(([
        key,
        value,
      ]) => !protectedKeys.has(key) && value !== undefined),
    );
    const cleanFields = {
      ...suppliedNamedFields,
      ...safeAdditionalFields,
    };

    if (!this.id) {
      const missingRequired = !this.name || !this.description || this.riskScore === undefined
        || !this.severity || !this.type;
      if (missingRequired) {
        throw new ConfigurationError("`name`, `description`, `riskScore`, `severity`, and `type` are required when creating a new rule (no `id` provided).");
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
      },
    });
    if (this.type && this.type !== current.type) {
      throw new ConfigurationError(`Cannot change a rule's type from \`${current.type}\` to \`${this.type}\` on update — type is fixed at creation. Delete and recreate the rule if you need a different type.`);
    }
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
