import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { createClient } from "@supabase/supabase-js";

export default {
  key: "supabase-new-row-added",
  name: "New Row Added",
  description: "Emit new event for every new row added in a table. [See documentation here](https://supabase.com/docs/reference/javascript/select)",
  version: "0.0.1",
  type: "source",
  props: {
    supabase: {
      type: "app",
      app: "supabase",
    },
    table: {
      type: "string",
      label: "Table",
      description: "The name of the table to watch for new rows",
    },
    rowIdentifier: {
      type: "string",
      label: "Row Identifier",
      description: "The column name to use as the row identifier",
      optional: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getOffset() {
      return this.db.get("offset") || 0;
    },
    _setOffset(offset) {
      this.db.set("offset", offset);
    },
    async _client() {
      return createClient(`https://${this.supabase.$auth.subdomain}.supabase.co`, this.supabase.$auth.service_key);
    },
  },
  async run() {
    const {
      table,
      rowIdentifier,
    } = this;

    const offset = this._getOffset();
    const client = await this._client();
    const query = client
      .from(table)
      .select()
      .range(offset, offset + 1000);

    const { data } = await query;
    this._setOffset(offset + data.length);

    for (const row of data) {
      let summary = "New row in table";
      if (row[rowIdentifier]) {
        summary = `${summary}: ${row[rowIdentifier]}`;
      }
      this.$emit(row, {
        summary,
      });
    }
  },
};
