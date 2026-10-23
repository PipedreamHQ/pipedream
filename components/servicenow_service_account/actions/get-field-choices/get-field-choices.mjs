import { assertSafeQueryValue } from "@pipedream/servicenow/common/utils.mjs";
import servicenow from "../../servicenow_service_account.app.mjs";
import { asRows } from "../../common/utils.mjs";

export default {
  key: "servicenow_service_account-get-field-choices",
  name: "Get Field Choices",
  description: "Retrieve the choice-list values of a field on a ServiceNow table from `sys_choice` (for example the `state` or `urgency` values of `incident`). Each result has the display `label`, its `language`, and the stored `value` to submit in **Create Table Record** or **Update Table Record**. Multilingual instances return one entry per language for the same `value`. Run **Get Table Fields** first to find the field `element` name. Example: table `incident` and field `urgency` returns entries such as `{\"label\": \"1 - High\", \"value\": \"1\"}`. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
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
    field: {
      type: "string",
      label: "Field",
      description: "The field name on the table, from the `element` field returned by **Get Table Fields**. Example: `state`.",
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.table, "Table");
    assertSafeQueryValue(this.field, "Field");

    const choices = asRows(await this.servicenow.getTableRecords({
      $,
      table: "sys_choice",
      params: {
        sysparm_query: `name=${this.table}^element=${this.field}^inactive=false^ORDERBYsequence`,
        sysparm_fields: "label,value,language,sequence,dependent_value",
      },
    }));
    $.export("$summary", `Retrieved ${choices.length} choice(s) for ${this.table}.${this.field}`);

    return choices;
  },
};
