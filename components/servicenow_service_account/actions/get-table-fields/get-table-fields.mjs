import { assertSafeQueryValue } from "@pipedream/servicenow/common/utils.mjs";
import servicenow from "../../servicenow_service_account.app.mjs";
import { asRows } from "../../common/utils.mjs";

export default {
  key: "servicenow_service_account-get-table-fields",
  name: "Get Table Fields",
  description: "Retrieve the field definitions of a ServiceNow table from `sys_dictionary`: field `element` name, label, type, whether it is `mandatory` or `read_only`, the referenced table for reference fields, and `max_length`. Use this before **Create Table Record** or **Update Table Record** to learn the valid field names and which ones the schema requires. Inherited fields come from the parent table, so query the parent as well when needed. Use **Get Field Choices** for choice-list values. Returns up to `limit` rows (default 100); if exactly `limit` rows come back, call again with `offset` raised by `limit` to get the rest. Example: table `incident` with Mandatory Only returns entries such as `{\"element\": \"short_description\", \"mandatory\": \"true\"}` for each field the schema requires. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    table: {
      propDefinition: [
        servicenow,
        "table",
      ],
    },
    mandatoryOnly: {
      type: "boolean",
      label: "Mandatory Only",
      description: "If true, only return fields marked mandatory in the schema.",
      optional: true,
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
      default: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of rows to skip for pagination (maps to `sysparm_offset`).",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.table, "Table");

    const mandatoryFilter = this.mandatoryOnly
      ? "^mandatory=true"
      : "";
    const fields = asRows(await this.servicenow.getTableRecords({
      $,
      table: "sys_dictionary",
      params: {
        sysparm_query: `name=${this.table}^elementISNOTEMPTY${mandatoryFilter}^ORDERBYelement`,
        sysparm_fields: "element,column_label,internal_type,mandatory,read_only,reference,max_length,active,default_value",
        sysparm_limit: this.limit,
        sysparm_offset: this.offset,
      },
    }));
    $.export("$summary", `Retrieved ${fields.length} field(s) for table ${this.table}`);

    return fields;
  },
};
