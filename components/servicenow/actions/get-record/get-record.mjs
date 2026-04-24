import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-record",
  name: "Get Record",
  description: "Retrieves a single record from a ServiceNow table by its sys_id. Use this when you already have a record's sys_id and need its full details. For example, to get an incident, set table_name to 'incident' and provide the sys_id.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    table: {
      type: "string",
      label: "Table",
      description: "The API name of the table (e.g., 'incident', 'sc_request', 'change_request').",
    },
    sysId: {
      type: "string",
      label: "Record sys_id",
      description: "The 32-character `sys_id` of the record to retrieve. Obtain via **Search Records**.",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return. Omit to return all fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.fields) params.sysparm_fields = this.fields;

    const record = await this.app.getTableRecordById({
      $,
      table: this.table,
      recordId: this.sysId,
      params,
    });

    $.export("$summary", `Retrieved record ${this.sysId} from "${this.table}"`);

    return record;
  },
};
