import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for every `insert`, `update`, or `delete` operation in a table. This source requires user configuration using the Supabase website. More information in the README. [Also see documentation here](https://supabase.com/docs/guides/database/webhooks#creating-a-webhook)",
  version: "0.0.1",
  type: "source",
  props: {
    supabase,
    http: {
      type: "$.interface.http",
    },
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
  async run(event) {
    const { body: data } = event;
    let summary = `New ${data.type} event in table`;
    if (data.record?.[this.rowIdentifier]) {
      summary = `${summary}: ${data.record[this.rowIdentifier]}`;
    }
    this.$emit(data, {
      summary,
    });
  },
};
