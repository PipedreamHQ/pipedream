import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "data_stores-deleted-key-in-datastore",
  name: "Deleted Key in Datastore",
  description: "Emit new event when there is a key deleted in a Data Store. [Pipedream Data Store](https://pipedream.com/data-stores/).",
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
    generateMeta(key) {
      return {
        id: key,
        summary: `Deleted Key: ${key}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const keys = await this.dataStore.keys();
    const previousKeys = this._getPreviousKeys();
    const currentKeys = {};
    keys.forEach((key) => {
      delete previousKeys[key];
      currentKeys[key] = true;
    });
    Object.keys(previousKeys).forEach((key) => {
      this.emitEvent({
        key,
      });
    });
    this._setPreviousKeys(currentKeys);
  },
};
