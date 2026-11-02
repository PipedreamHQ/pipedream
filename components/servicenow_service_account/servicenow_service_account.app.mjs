import servicenow from "@pipedream/servicenow";

const { propDefinitions } = servicenow;

export default {
  ...servicenow,
  app: "servicenow_service_account",
  propDefinitions: {
    ...propDefinitions,
    table: {
      ...propDefinitions.table,
      label: "Table",
      description: "The table name (not label), for example `incident`. Run **List Tables** to search for a table by name or label.",
    },
    recordId: {
      ...propDefinitions.recordId,
      label: "Record ID",
      description: "The ID (`sys_id` field) of the record. Run **Get Table Records** or **Search Records by Keyword** to find it. Example: `46d44a23a9fe19810012d100cca80666`.",
    },
    includeInactive: {
      type: "boolean",
      label: "Include Inactive",
      description: "If true, also return inactive policies. Defaults to active policies only. Example: `true`.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of rows to skip for pagination (maps to `sysparm_offset`). Example: `100` to get the second page when `limit` is 100.",
      min: 0,
      optional: true,
    },
    requestedFor: {
      ...propDefinitions.requestedFor,
      label: "Requested For",
      description: `${propDefinitions.requestedFor.description.split("the connected user").join("the integration user")} If omitted, ServiceNow also requests it for the integration user, not the person you act for. Example: \`46d44a23a9fe19810012d100cca80666\`.`,
    },
  },
};
