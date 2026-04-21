import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-search-records",
  name: "Search Records",
  description: "Query any ServiceNow table using an encoded query string. Works for every table (`incident`, `sys_user`, `change_request`, `sc_req_item`, `problem`, `cmdb_ci`, custom tables, etc.)."
    + " **When to use:** finding, listing, filtering, or searching any ServiceNow records. Prefer this over fetching by ID when the caller describes the record by content (title, priority, assignee, state)."
    + " **Encoded query syntax:** operators are part of the field segment, and conditions are joined with `^` (AND) or `^OR` (OR)."
    + " Examples:"
    + " `active=true^priority=1` (active P1 records),"
    + " `short_descriptionLIKEvelociraptor` (substring match),"
    + " `assigned_to={sys_id}^state!=7` (mine, not closed),"
    + " `sys_created_on>=javascript:gs.daysAgoStart(7)` (created in the last week),"
    + " `number=INC0012345` (lookup by human-readable number)."
    + " **Cross-references:** call **Get Current User** first to get your `sys_id` for any 'my records' filter. Call **Describe Table** if you don't know what columns a table has."
    + " **Common mistakes:** don't URL-encode the query yourself — pass it raw. Use `^` (not `&`) between conditions. `LIKE` is substring; `=` is exact."
    + " [See the encoded query docs](https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/use/using-lists/concept/c_EncodedQueryStrings.html)",
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
      description: "Internal name of the ServiceNow table to query (e.g. `incident`, `sys_user`, `change_request`, `sc_req_item`, `problem`, `cmdb_ci`). Use the table's internal name, not its label.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Encoded query string. Example: `active=true^priority=1^assigned_to={sys_id}`. Omit to return recent records with no filter.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return. Example: `sys_id,number,short_description,priority,state,assigned_to`. Omit to return all fields (heavier payload).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return (default 20, max 1000).",
      min: 1,
      max: 1000,
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      sysparm_limit: this.limit ?? 20,
    };
    if (this.query) params.sysparm_query = this.query;
    if (this.fields) params.sysparm_fields = this.fields;

    const records = await this.app.getTableRecords({
      $,
      table: this.table,
      params,
    });

    const count = records?.length ?? 0;
    $.export("$summary", `Found ${count} record(s) in "${this.table}"`);

    return records;
  },
};
