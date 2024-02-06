import supabase from "../../supabase.app.mjs";

export default {
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
      description: "The name of the table to watch for new rows",
    },
    rowIdentifier: {
      type: "string",
      label: "Row Identifier",
      description: "The column name to use as the row identifier",
      optional: true,
    },
  },
};
