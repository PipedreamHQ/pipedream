import moment from "moment";
import nocodb from "../../nocodb.app.mjs";

export default {
  props: {
    nocodb,
    projectId: {
      propDefinition: [
        nocodb,
        "projectId",
      ],
    },
    tableName: {
      propDefinition: [
        nocodb,
        "tableName",
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
        intervalSeconds: 60 * 15, // 15 minutes
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
        params,
      });

      for await (const record of records) {
        if ( moment(record[timeField]).isAfter(lastTime)) this._setLastTime(record[timeField]);
        this.$emit(record,  this.getDataToEmit(record));
      }
    },
  },
  hooks: {
    async activate() {
      const timeField = this.getTimeField();
      const lastTime = this._getLastTime();
      const { list } = await this.nocodb.listTableRow({
        projectId: this.projectId,
        tableName: this.tableName.value,
        query: {
          sort: `-${timeField}`,
        },
      });

      list.reverse();

      for (const row of list) {
        if (!lastTime || moment(lastTime).isAfter(row[timeField])) {
          this._setLastTime(row[timeField]);
        }
        this.$emit(row,  this.getDataToEmit(row));
      }
    },
  },
  async run() {
    const {
      projectId,
      tableName,
    } = this;

    const timeField = this.getTimeField();
    const lastTime = this._getLastTime();
    const params = {
      query: {
        sort: timeField,
      },
      projectId,
      tableName: tableName.value,
    };
    // moment is necessary because nocodb query doesn't filter equal datetime in 'greater than'
    if (lastTime) params.query.where = `(${timeField},gte,${moment(lastTime).add(1, "ms")
      .toISOString()})`;
    return await this.processEvent({
      params,
      lastTime,
    });
  },
};

