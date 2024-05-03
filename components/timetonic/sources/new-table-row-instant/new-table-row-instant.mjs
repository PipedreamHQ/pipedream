import timetonic from "../../timetonic.app.mjs";

export default {
  key: "timetonic-new-table-row-instant",
  name: "New Table Row Instant",
  description: "Emits an event when a new table row is added in TimeTonic",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    timetonic,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
      ],
    },
  },
  methods: {
    ...timetonic.methods,
    generateMeta(row) {
      const {
        id, created,
      } = row;
      const summary = `New Row: ${id}`;
      return {
        id,
        summary,
        ts: Date.parse(created),
      };
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.timestamp;
    const params = {
      req: "getTableValues",
      version: "0.0.{{ts}}",
      catId: this.tableId,
      filterRowIds: JSON.stringify({
        applyViewFilters: {
          filterGroup: {
            operator: "and",
            filters: [
              {
                id: "tmpId",
                json: {
                  predicate: "after",
                  operand: new Date(lastRunTime).toISOString(),
                },
                field_id: "1735324",
                filter_type: "date",
              },
            ],
          },
        },
      }),
      format: "rows",
    };
    const { data } = await this.timetonic._makeRequest({
      method: "POST",
      path: "/getTableValues",
      data: params,
    });
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        const meta = this.generateMeta(row);
        this.$emit(row, meta);
      });
      const maxCreated = Math.max(...data.map((row) => Date.parse(row.created)));
      this.db.set("lastRunTime", new Date(maxCreated).toISOString());
    }
  },
};
