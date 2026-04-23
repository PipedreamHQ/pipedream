import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-delete-record",
  name: "Delete Record",
  description: "Permanently delete a ServiceNow record by `sys_id`. Irreversible."
    + " **When to use:** the caller explicitly asks to delete, remove, or discard a specific record."
    + " **Returns:** `{ success: true, table, sys_id }` on success."
    + " **Cross-references:** if you only have a description or number, call **Search Records** first to get the `sys_id`. Consider whether closing/cancelling (via **Update Record** setting `state`) is more appropriate than a hard delete — most ServiceNow workflows prefer state transitions over deletion."
    + " **Common mistakes:** delete is not reversible; there is no undo. For audit-critical tables (incident, change_request), consider whether the record should be closed rather than deleted."
    + " [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-DELETE)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    table: {
      type: "string",
      label: "Table",
      description: "Internal name of the ServiceNow table (e.g. `incident`).",
    },
    sys_id: {
      type: "string",
      label: "Record sys_id",
      description: "`sys_id` of the record to delete. Obtain via **Search Records**.",
    },
  },
  async run({ $ }) {
    await this.app.deleteTableRecord({
      $,
      table: this.table,
      recordId: this.sys_id,
    });

    $.export("$summary", `Deleted ${this.table} record ${this.sys_id}`);

    return {
      success: true,
      table: this.table,
      sys_id: this.sys_id,
    };
  },
};
