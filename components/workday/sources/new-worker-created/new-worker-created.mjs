import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "workday-new-worker-created",
  name: "New Worker Created",
  description: "Emit new event for each new worker created in Workday. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/get-/workers)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    _setPreviousIds(ids) {
      this.db.set("previousIds", ids);
    },
    generateMeta(worker) {
      return {
        id: worker.id,
        summary: `New worker created: ${worker.descriptor}`,
        ts: Date.now(),
      };
    },
    async processEvent(limit) {
      const results = this.workday.paginate({
        fn: this.workday.listWorkers,
      });

      const previousIds = this._getPreviousIds();
      let workers = [];

      for await (const worker of results) {
        if (previousIds[worker.id]) {
          continue;
        }
        workers.push(worker);
        previousIds[worker.id] = true;
      }

      this._setPreviousIds(previousIds);

      if (!workers?.length) {
        return;
      }

      if (limit) {
        workers = workers.slice(0, limit);
      }

      for (const worker of workers) {
        const meta = this.generateMeta(worker);
        this.$emit(worker, meta);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
