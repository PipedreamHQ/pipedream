import base from "../common/base.mjs";

export default {
  ...base,
  key: "jsonify-new-dataset-version",
  name: "New Dataset Version",
  description: "Emit new event when a Jsonify dataset publishes a new version. [See the documentation](https://www.jsonify.com/docs/datasets/versions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const head = await this.getHead();
      this.setLastVersion(head.version);
    },
  },
  methods: {
    ...base.methods,
    generateMeta(head) {
      return {
        id: `${head.dataset}-${head.version}`,
        summary: `${head.dataset_name} v${head.version}`,
        ts: Math.round((head.updated_at || Date.now() / 1000) * 1000),
      };
    },
  },
  async run() {
    const head = await this.getHead();
    const last = this.getLastVersion();
    if (last !== undefined && last !== null && head.version <= last) {
      return;
    }
    this.setLastVersion(head.version);
    const event = {
      dataset: head.dataset,
      dataset_name: head.dataset_name,
      table: head.table,
      version: head.version,
      previous_version: last ?? null,
      updated_at: head.updated_at,
    };
    this.$emit(event, this.generateMeta(head));
  },
};
