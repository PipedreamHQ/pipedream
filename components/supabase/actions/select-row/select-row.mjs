import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-select-row",
  name: "Select Row",
  type: "action",
  version: "0.0.1",
  description: "Selects row(s) in a database. [See the docs here](https://supabase.com/docs/reference/javascript/select)",
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
    },
    column: {
      propDefinition: [
        supabase,
        "column",
      ],
    },
    value: {
      propDefinition: [
        supabase,
        "value",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.supabase.selectRow(this.table, this.column, this.value);
    if (response) {
      $.export("$summary", `Successfully retrieved ${response.length} rows from table ${this.table}`);
    }
    return response;
  },
};
