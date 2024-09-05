import timetonic from "../../timetonic.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    timetonic,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    bookCode: {
      propDefinition: [
        timetonic,
        "bookCode",
      ],
    },
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
        (c) => ({
          bookCode: c.bookCode,
        }),
      ],
    },
  },
  methods: {
    formatFields(rows) {
      rows.forEach((row) => {
        const fields = {};
        for (const [
          key,
          value,
        ] of Object.entries(row.fields)) {
          fields[key] = value.value;
        }
        row.fields = fields;
      });
      return rows;
    },
  },
  async run() {
    const params = {
      catId: this.tableId,
      b_c: this.bookCode,
      format: "rows",
    };
    if (this.viewId) {
      params.filterRowIds = {
        applyViewFilters: this.viewId,
      };
    }
    const results = this.timetonic.paginate({
      resourceFn: this.timetonic.getTableValues,
      params,
    });
    const rows = [];
    for await (const row of results) {
      rows.push(row);
    }
    const formattedRows = this.formatFields(rows);
    await this.processRows(formattedRows);
  },
};
