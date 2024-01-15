import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "data_stores-update-in-datastore",
  name: "Update in Datastore",
  description: "Emit new event when a value is updated in a Data Store. [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousValues() {
      return this.db.get("previousValues") || {};
    },
    _setPreviousValues(previousValues) {
      this.db.set("previousValues", previousValues);
    },
    generateMeta(record) {
      const key = Object.keys(record)[0];
      const ts = Date.now();
      return {
        id: `${key}${ts}`,
        summary: `Updated value for key: ${key}`,
        ts,
      };
    },
  },
  async run() {
    const keys = await this.dataStore.keys();
    const previousValues = this._getPreviousValues();
    const currentValues = {};
    for (const key of keys) {
      const value = await this.dataStore.get(key);
      if (previousValues[key] !== JSON.stringify(value)) {
        this.emitEvent({
          [key]: value,
        });
      }
      currentValues[key] = JSON.stringify(value);
    }
    this._setPreviousValues(currentValues);
  },
};
