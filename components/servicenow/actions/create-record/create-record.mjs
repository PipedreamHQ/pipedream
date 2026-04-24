import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-create-record",
  name: "Create Record",
  description: "Insert a new record into any ServiceNow table (incident, change_request, problem, sys_user, custom tables, etc.)."
    + " **When to use:** the caller wants to open an incident, file a change request, create a user, or insert a row into any ServiceNow table via raw Table API. For Service Catalog orders use **Order Catalog Item** or **Submit Record Producer** instead."
    + " **Returns:** the created record including the auto-generated `sys_id` and `number`."
    + " **Cross-references:** call **Describe Table** first to see valid field names, required fields, and choice values. Call **Get Current User** if you need the caller's `sys_id` for `caller_id` / `opened_by` / `assigned_to`."
    + " **Parameter guidance:** `data` is a JSON object string. Example: `{\"short_description\":\"Printer offline\",\"priority\":\"3\",\"caller_id\":\"6816f79cc0a8016401c5a33be04be441\"}`."
    + " **Common mistakes:** `sys_*` fields (sys_id, sys_created_on, sys_updated_by) are auto-populated — don't send them. Choice fields take the numeric code as a string (`priority: \"1\"`), not the display label (`\"Critical\"`). Reference fields take the `sys_id` of the referenced record, not its name."
    + " [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-POST)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    table: {
      type: "string",
      label: "Table",
      description: "Internal name of the ServiceNow table to insert into (e.g. `incident`, `change_request`, `problem`, `sys_user`).",
    },
    data: {
      type: "string",
      label: "Data",
      description: "JSON object of field name → value pairs to set on the new record."
        + " Example: `{\"short_description\":\"Printer offline\",\"priority\":\"3\",\"category\":\"hardware\"}`."
        + " Use **Describe Table** to discover valid field names and choice values.",
    },
  },
  async run({ $ }) {
    const data = parseObject(this.data);

    const record = await this.app.createTableRecord({
      $,
      table: this.table,
      data,
    });

    const identifier = record?.number || record?.sys_id || "(unknown)";
    $.export("$summary", `Created ${this.table} record ${identifier}`);

    return record;
  },
};
