import quickbase from "../../quickbase.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "quickbase-new-record",
  name: "New Record",
  description: "Emit new event each time a new record is created in a specified table in Quickbase.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    quickbase,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    appId: {
      propDefinition: [
        quickbase,
        "appId",
      ],
    },
    tableId: {
      propDefinition: [
        quickbase,
        "tableId",
        (c) => ({
          appId: c.appId,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(record, keyFieldId) {
      const meta = this.generateMeta(record, keyFieldId);
      this.$emit(record, meta);
    },
    generateMeta(record, keyFieldId) {
      const id = record[keyFieldId].value;
      return {
        id,
        summary: `New Record ${id}`,
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      const lastId = this._getLastId();
      const { keyFieldId } = await this.quickbase.getTable({
        tableId: this.tableId,
        params: {
          appId: this.appId,
        },
      });
      const fields = await this.quickbase.listFields({
        params: {
          tableId: this.tableId,
        },
      });
      const select = fields.map(({ id }) => id);
      select.push(keyFieldId);

      const records = this.quickbase.paginate({
        resourceFn: this.quickbase.listRecords,
        args: {
          data: {
            from: this.tableId,
            select,
            where: `{${keyFieldId}.GT.${lastId}}`,
            sortBy: [
              {
                fieldId: keyFieldId,
                order: "DESC",
              },
            ],
          },
        },
        max,
      });

      const newRecords = [];
      for await (const record of records) {
        newRecords.push(record);
      }

      if (!newRecords.length) {
        return;
      }

      this._setLastId(newRecords[0][keyFieldId].value);
      newRecords.reverse().forEach((record) => this.emitEvent(record, keyFieldId));
    },
  },
  async run() {
    await this.processEvent();
  },
};
