import ninox from "../../app/ninox.app";

export default {
  props: {
    ninox,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    teamId: {
      propDefinition: [
        ninox,
        "teamId",
      ],
    },
    databaseId: {
      propDefinition: [
        ninox,
        "databaseId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        ninox,
        "tableId",
        (c) => ({
          teamId: c.teamId,
          databaseId: c.databaseId,
        }),
      ],
    },
  },
  methods: {
    emitEvent(event) {
      throw new Error("emitEvent is not implemented - " + event);
    },
    getTimestampField() {
      throw new Error("getTimestampField is not implemented");
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
  },
  hooks: {
    async deploy() {
      this._setLastTimestamp(new Date().getTime())

      const records = await this.ninox.getRecords({
        teamId: this.teamId,
        databaseId: this.databaseId,
        tableId: this.tableId,
      });

      records.slice(-20).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();

    let page = 0;

    while (true) {
      const records = await this.ninox.getRecords({
        teamId: this.teamId,
        databaseId: this.databaseId,
        tableId: this.tableId,
        params: {
          page,
        },
      });

      records.filter((record) => Date.parse(record[this.getTimestampField()]) >= lastTimestamp).forEach(this.emitEvent)

      if (records.length < 100) {
        return;
      }

      page++;
    }
  },
};
