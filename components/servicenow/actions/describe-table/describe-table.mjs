import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-describe-table",
  name: "Describe Table",
  description: "Returns the column schema for a ServiceNow table: every field's internal name, label, type, reference table (for reference fields), choice values, and mandatory flag."
    + " **When to use:** before **Create Record**, **Update Record**, or **Search Records** on a table whose columns you don't already know. Call this instead of guessing field names."
    + " **Returns:** an array of column definitions from `sys_dictionary` with `element` (field name), `column_label`, `internal_type`, `reference` (referenced table for reference-type fields), `mandatory`, and `default_value`."
    + " **Cross-references:** feed field names from `element` into **Create Record**'s `data` and **Search Records**'s `query`. For fields with `internal_type=reference`, look up valid values by calling **Search Records** on the `reference` table."
    + " **Common mistakes:** field names in ServiceNow use snake_case, not camelCase (`short_description`, not `shortDescription`). Choice fields store integer-as-string codes (e.g. `priority=1`), not the display label."
    + " [See the documentation](https://docs.servicenow.com/bundle/zurich-platform-administration/page/administer/reference-pages/concept/c_SchemaTable.html)",
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
      description: "Internal name of the ServiceNow table to describe (e.g. `incident`, `sys_user`, `change_request`).",
    },
  },
  async run({ $ }) {
    const columns = await this.app.getTableRecords({
      $,
      table: "sys_dictionary",
      params: {
        sysparm_query: `name=${this.table}^ORDERBYelement`,
        sysparm_fields: "element,column_label,internal_type,reference,mandatory,max_length,default_value,choice",
        sysparm_display_value: "true",
        sysparm_exclude_reference_link: "true",
        sysparm_limit: 1000,
      },
    });

    const visible = (columns ?? []).filter((c) => c.element);

    $.export("$summary", `Described "${this.table}" — ${visible.length} column(s)`);

    return visible;
  },
};
