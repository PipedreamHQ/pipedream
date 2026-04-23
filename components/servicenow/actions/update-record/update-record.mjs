import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-update-record",
  name: "Update Record",
  description: "Partially update (PATCH) a ServiceNow record by `sys_id`. Only the fields you include in `data` are modified; everything else is preserved."
    + " **When to use:** changing a record's priority, state, assignee, description, or any other field after you've located it via **Search Records** or **Get Record**."
    + " **Returns:** the full updated record."
    + " **Cross-references:** if the caller described the record by content (\"the velociraptor incident\", \"INC0012345\"), call **Search Records** first to get the `sys_id`. Call **Describe Table** to check valid field names and choice values before updating."
    + " **Parameter guidance:** `data` is a JSON object string with just the fields to change. Example: `{\"priority\":\"1\",\"state\":\"2\"}`."
    + " **Common mistakes:** this tool does a PATCH, never a PUT — you cannot use it to blank out unlisted fields (that's intentional, to prevent accidental wipes). Choice values are numeric strings (`\"1\"`), not display labels (`\"Critical\"`)."
    + " [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-PATCH)",
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
      description: "Internal name of the ServiceNow table (e.g. `incident`, `change_request`).",
    },
    sys_id: {
      type: "string",
      label: "Record sys_id",
      description: "`sys_id` of the record to update. Obtain via **Search Records**.",
    },
    data: {
      type: "string",
      label: "Data",
      description: "JSON object of the fields to change. Example: `{\"priority\":\"1\",\"state\":\"2\"}`.",
    },
  },
  async run({ $ }) {
    const data = parseObject(this.data);

    const record = await this.app.updateTableRecord({
      $,
      table: this.table,
      recordId: this.sys_id,
      data,
    });

    const identifier = record?.number || this.sys_id;
    $.export("$summary", `Updated ${this.table} record ${identifier}`);

    return record;
  },
};
