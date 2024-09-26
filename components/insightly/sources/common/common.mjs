import insightly from "../../insightly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    insightly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    recordType: {
      propDefinition: [
        insightly,
        "recordType",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getRecordId(record) {
      const idKey = constants.RECORD_ID_FIELDS[this.recordType];
      return record[idKey];
    },
    emitEvent(record) {
      const meta = this.generateMeta(record);
      this.$emit(record, meta);
    },
    generateMeta() {
      throw new Error ("generateMeta is not implemented");
    },
    async getPaginatedResults(lastTs) {
      const params = {
        top: lastTs
          ? constants.DEFAULT_PAGE_SIZE
          : constants.DEFAULT_HISTORICAL_EVENTS,
        skip: 0,
      };
      const results = [];
      let total = 0;
      do {
        const items = await this.insightly.listRecords({
          recordType: this.recordType,
          params,
        });
        results.push(...items);
        params.skip += params.top;
        total = items.length;
      } while (total === params.top && lastTs);
      return results;
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const results = await this.getPaginatedResults(lastTs);

    for (const record of results) {
      const ts = Date.parse(record[this.getTsKey()]);
      if (ts > lastTs) {
        this.emitEvent(record);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
