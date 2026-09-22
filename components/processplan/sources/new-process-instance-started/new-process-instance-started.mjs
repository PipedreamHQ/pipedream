import common from "../common/base.mjs";

export default {
  ...common,
  key: "processplan-new-process-instance-started",
  name: "New Process Instance Started",
  description: "Emit new event each time a process instance is started. [See the documentation](https://techdocs.processplan.com/)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(item) {
      return {
        id: String(item.ih_id),
        summary: `Process Instance ${item.ih_id}`,
        ts: Date.parse(item.ih_created_date_local || new Date()),
      };
    },
    async processEvents(max) {
      const seenIds = this._getSeenIds();
      const { process_instance_header_list: items } = await this.app.listProcessInstances();

      const newItems = items
        .filter(({ ih_id }) => !seenIds.has(String(ih_id)))
        .slice(0, max);

      items.forEach(({ ih_id }) => seenIds.add(String(ih_id)));
      newItems.forEach((item) => this.$emit(item, this.generateMeta(item)));

      this._saveSeenIds(seenIds);
    },
  },
  async run() {
    await this.processEvents(25);
  },
};
