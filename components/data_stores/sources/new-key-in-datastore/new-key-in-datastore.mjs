import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "data_stores-new-key-in-datastore",
  name: "New Key in Datastore",
  description: "Emit new event when there is a new key in a Data Store. [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousKeys() {
      return this.db.get("previousKeys") || {};
    },
    _setPreviousKeys(previousKeys) {
      this.db.set("previousKeys", previousKeys);
    },
    generateMeta(record) {
      const key = Object.keys(record)[0];
      return {
        id: key,
        summary: `New Key: ${key}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const keys = await this.dataStore.keys();
    const previousKeys = this._getPreviousKeys();
    const currentKeys = {};
    for (const key of keys) {
      if (!previousKeys[key]) {
        const value = await this.dataStore.get(key);
        this.emitEvent({
          [key]: value,
        });
      }
      currentKeys[key] = true;
    }
    this._setPreviousKeys(currentKeys);
  },
};
