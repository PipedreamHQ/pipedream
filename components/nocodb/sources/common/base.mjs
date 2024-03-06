import moment from "moment";
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
    async processEvent({
      params, lastTime,
    }) {
      const timeField = this.getTimeField();

      const records = this.nocodb.paginate({
        fn: this.nocodb.listTableRow,
        args: {
          tableId: this.tableId.value,
          params,
        },
      });

      for await (const record of records) {
        if (moment(record[timeField]).isAfter(lastTime)) this._setLastTime(record[timeField]);
        this.$emit(record, this.getDataToEmit(record));
      }
    },
  },
  hooks: {
    async activate() {
      const timeField = this.getTimeField();
      const lastTime = this._getLastTime();
      const { list } = await this.nocodb.listTableRow({
        tableId: this.tableId.value,
        params: {
          sort: `-${timeField}`,
        },
      });

      list.reverse();

      for (const row of list) {
        if (!lastTime || moment(lastTime).isAfter(row[timeField])) {
          this._setLastTime(row[timeField]);
        }
        this.$emit(row, this.getDataToEmit(row));
      }
    },
  },
  async run() {
    const timeField = this.getTimeField();
    const lastTime = this._getLastTime();
    const params = {
      sort: timeField,
    };
    // moment is necessary because nocodb query doesn't filter equal datetime in 'greater than'
    if (lastTime) params.where = `(${timeField},gte,${moment(lastTime).add(1, "ms")
      .toISOString()})`;
    return this.processEvent({
      params,
      lastTime,
    });
  },
};

