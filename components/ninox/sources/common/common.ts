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
      throw new Error("emitEvent is not implemented");
    },
    _setLastRecordId(id) {
      this.db.set("lastRecordId", id);
    },
    _getLastRecordId() {
      return this.db.get("lastRecordId");
    },
  },
  async run() {
    const lastRecordId = this._getLastRecordId();

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

      records.reverse().forEach(this.emitEvent);

      if (
        records.length < 100 ||
        records.filter((record) => record.id === lastRecordId).length
      ) {
        return;
      }

      page++;
    }
  },
};
