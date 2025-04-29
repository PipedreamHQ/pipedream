import airtable from "../../airtable_oauth.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    airtable,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
    filterByFormula: {
      propDefinition: [
        airtable,
        "filterByFormula",
      ],
    },
  },
  hooks: {
    activate() {
      const startTimestamp = new Date().toISOString();
      this._setLastTimestamp(startTimestamp);
    },
    deactivate() {
      this._setLastTimestamp(null);
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(lastTimestamp) {
      this.db.set("lastTimestamp", lastTimestamp);
    },
    updateLastTimestamp(event) {
      const { timestamp } = event;
      const timestampMillis = timestamp
        ? timestamp * 1000
        : Date.now();
      const formattedTimestamp = new Date(timestampMillis).toISOString();
      this._setLastTimestamp(formattedTimestamp);
    },
    getListRecordsParams({
      formula, ...params
    } = {}) {
      let filterByFormula = formula;

      if (this.filterByFormula) {
        filterByFormula = `AND(${formula}, ${this.filterByFormula})`;
      }

      return {
        filterByFormula,
        returnFieldsByFieldId: this.returnFieldsByFieldId || false,
        ...params,
      };
    },
  },
};
