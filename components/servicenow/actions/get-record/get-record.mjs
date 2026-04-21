import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-record",
  name: "Get Record",
  description: "Fetch a single ServiceNow record from any table by its `sys_id`."
    + " **When to use:** you already know the `sys_id` (from a prior **Search Records** call, a URL, or user input) and want the full record."
    + " **Returns:** the complete record with all fields (or the fields listed in `fields`)."
    + " **Cross-references:** if you only have a human-readable identifier (incident number, name), call **Search Records** first with `number=INC0012345` to resolve the `sys_id`."
    + " **Common mistakes:** `sys_id` is a 32-char hex string — don't confuse it with `number` (e.g. `INC0012345`). If you only have `number`, use **Search Records**, not this tool."
    + " [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-GET-id)",
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
      description: "Internal name of the ServiceNow table (e.g. `incident`, `sys_user`, `sc_req_item`).",
    },
    sys_id: {
      type: "string",
      label: "Record sys_id",
      description: "The 32-character `sys_id` of the record to fetch.",
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
      recordId: this.sys_id,
      params,
    });

    $.export("$summary", `Retrieved record ${this.sys_id} from "${this.table}"`);

    return record;
  },
};
