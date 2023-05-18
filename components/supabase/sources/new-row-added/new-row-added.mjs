import supabase from "../../supabase.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
  ConfigurationError,
} from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "supabase-new-row-added",
  name: "New Row Added",
  description: "Emit new event for every new row added in a table. [See documentation here](https://supabase.com/docs/reference/javascript/select)",
  version: "0.0.1",
  type: "source",
  props: {
    supabase,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
      description: "The name of the table to watch for new rows",
    },
    column: {
      propDefinition: [
        supabase,
        "column",
      ],
      optional: true,
    },
    filter: {
      propDefinition: [
        supabase,
        "filter",
      ],
      optional: true,
    },
    value: {
      propDefinition: [
        supabase,
        "value",
      ],
      optional: true,
    },
    orderBy: {
      propDefinition: [
        supabase,
        "column",
      ],
      label: "Order By",
      description: "Column name to order by",
    },
    sortOrder: {
      propDefinition: [
        supabase,
        "sortOrder",
      ],
    },
    rowIdentifier: {
      type: "string",
      label: "Row Identifier",
      description: "The column name to use as the row identifier",
      optional: true,
    },
  },
  methods: {
    _getOffset() {
      return this.db.get("offset") || 0;
    },
    _setOffset(offset) {
      this.db.set("offset", offset);
    },
  },
  async run() {
    const {
      table,
      column,
      filter,
      value,
      orderBy,
      sortOrder,
      rowIdentifier,
    } = this;

    if ((column || filter || value) && !(column && filter && value)) {
      throw new ConfigurationError("If `column`, `filter`, or `value` is used, all three must be entered");
    }

    const offset = this._getOffset();
    const client = await this.supabase._client();
    const query = client
      .from(table)
      .select()
      .order(orderBy, {
        ascending: sortOrder,
      })
      .range(offset, offset + constants.MAX_OFFSET);

    if (filter) {
      const filterMethod = this.supabase[filter];
      filterMethod(query, column, value);
    }

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
