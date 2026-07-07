import zohoCrm from "../../zoho_crm.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "zoho_crm-upsert-records",
  name: "Upsert Records",
  description: "Inserts new records or updates existing ones based on duplicate check field values. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v8/upsert-records.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoCrm,
    module: {
      propDefinition: [
        zohoCrm,
        "module",
      ],
    },
    data: {
      type: "string",
      label: "Data",
      description: "An array of record objects to insert or update (maximum 100). Use Field API names as keys (e.g., `Last_Name`, `Email`). Each record may include `$append_values` for multi-select picklists. Use the **List Fields** action to get available field API names.",
    },
    duplicateCheckFields: {
      type: "string[]",
      label: "Duplicate Check Fields",
      description: "Field API names to use for duplicate checking (e.g., `Email`, `Phone`). If not specified, system-defined duplicate check fields are used first, followed by user-defined unique fields.",
      optional: true,
    },
    skipCadences: {
      type: "boolean",
      label: "Skip Cadences",
      description: "Whether to skip Cadences execution during record upsert.",
      optional: true,
    },
    skipCadencesAction: {
      type: "string",
      label: "Skip Cadences Action",
      description: "The action for which to skip Cadences execution. Required when **Skip Cadences** is enabled.",
      options: [
        "insert",
        "update",
      ],
      optional: true,
    },
    trigger: {
      type: "string[]",
      label: "Trigger",
      description: "Workflow triggers to execute. Use an empty array `[]` to skip all workflows, approvals, and blueprints.",
      options: [
        "workflow",
        "approval",
        "blueprint",
      ],
      optional: true,
    },
    applyFeatureExecution: {
      type: "string[]",
      label: "Apply Feature Execution",
      description: "Additional CRM checks to trigger during record creation or update.",
      options: [
        "layout_rules",
        "criteria_validation_rule",
      ],
      optional: true,
    },
    ifUnmodifiedSince: {
      type: "string",
      label: "If Unmodified Since",
      description: "ISO 8601 timestamp (e.g., `2024-01-15T15:26:49+05:30`). The upsert will fail if the record was modified after this time.",
      optional: true,
    },
  },
  async run({ $ }) {
    let records = this.data;
    if (typeof records === "string") {
      try {
        records = JSON.parse(records);
      } catch {
        throw new ConfigurationError("Data must be valid JSON (a single record object or an array of record objects).");
      }
    }
    if (!Array.isArray(records)) {
      records = [
        records,
      ];
    }

    const requestData = {
      data: records,
      duplicate_check_fields: this.duplicateCheckFields,
      trigger: this.trigger,
    };

    if (this.skipCadences) {
      if (!this.skipCadencesAction) {
        throw new ConfigurationError("Skip Cadences Action is required when Skip Cadences is enabled.");
      }
      requestData.skip_feature_execution = [
        {
          name: "cadences",
          action: this.skipCadencesAction,
        },
      ];
    }

    if (this.applyFeatureExecution?.length) {
      requestData.apply_feature_execution = this.applyFeatureExecution.map((name) => ({
        name,
      }));
    }

    const opts = {};
    if (this.ifUnmodifiedSince) {
      opts.headers = {
        "If-Unmodified-Since": this.ifUnmodifiedSince,
      };
    }

    const res = await this.zohoCrm.upsertObject(this.module, requestData, $, opts);

    const results = res.data || [];
    const successes = results.filter(({ code }) => code === "SUCCESS");
    const failures = results.filter(({ code }) => code !== "SUCCESS");
    const formatFailure = (error) => error.code === "INVALID_DATA"
      ? `Invalid data for field '${error.details.api_name}' (expected ${error.details.expected_data_type})`
      : error.message;

    if (failures.length && !successes.length) {
      throw new ConfigurationError(failures.map(formatFailure).join("; "));
    }

    const summaries = successes.map((result) => {
      const action = result.action === "update"
        ? "updated"
        : "inserted";
      return `${action} ID ${result.details.id}`;
    });
    const failureMessages = failures.map(formatFailure).join("; ");
    const summary = failures.length
      ? `Successfully ${summaries.join(", ")}. Failed: ${failureMessages}`
      : summaries.length
        ? `Successfully ${summaries.join(", ")}.`
        : "No records were processed.";
    $.export("$summary", summary);

    return res;
  },
};
