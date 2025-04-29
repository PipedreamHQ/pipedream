import nocodb from "../../nocodb.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    nocodb,
    workspaceId: {
      propDefinition: [
        nocodb,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        nocodb,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        nocodb,
        "tableId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Nocodb API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTime() {
      return this.db.get("lastTime");
    },
    _setLastTime(lastTime) {
      this.db.set("lastTime", lastTime);
    },
    getParams(timeField) {
      return {
        sort: `-${timeField}`,
      };
    },
    async getRows(records, timeField, lastTime) {
      const rows = [];
      for await (const row of records) {
        if (!lastTime || Date.parse(row[timeField]) >= Date.parse(lastTime)) {
          rows.push(row);
        } else {
          break;
        }
      }
      return rows.reverse();
    },
    async processEvent(max) {
      const timeField = this.getTimeField();
      const lastTime = this._getLastTime();

      const records = this.nocodb.paginate({
        fn: this.nocodb.listTableRow,
        args: {
          tableId: this.tableId.value,
          params: this.getParams(timeField),
        },
        max,
      });

      const rows = await this.getRows(records, timeField, lastTime);

      if (!rows.length) {
        return;
      }

      this._setLastTime(rows[rows.length - 1][timeField]);

      rows.forEach((row) => this.$emit(row, this.getDataToEmit(row)));
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};

