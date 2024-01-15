import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "data_stores-run-if-key-is-populated",
  name: "Run If Key Is Populated",
  description: "Emit new event if the specified Data Store key is populated. [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    key: {
      propDefinition: [
        common.props.app,
        "key",
        ({ dataStore }) => ({
          dataStore,
        }),
      ],
      description: "Enter the key to check",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(record) {
      const key = Object.keys(record)[0];
      const ts = Date.now();
      return {
        id: `${key}${ts}`,
        summary: `Key ${key} is populated`,
        ts,
      };
    },
  },
  async run() {
    const value = await this.dataStore.get(this.key);
    if (value) {
      this.emitEvent({
        [this.key]: value,
      });
    }
  },
};
