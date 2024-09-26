import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-new-task-finished",
  name: "New Task Finished",
  description: "Emit new event when a task is finished on Outscraper.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    outscraper,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _setSavedItems(value) {
      this.db.set("items", value);
    },
    _getSavedItems() {
      return this.db.get("items") ?? [];
    },
    async getAndProcessItems(emit = true) {
      const savedItems = this._getSavedItems();
      const items = await this.outscraper.getRequests();

      const idsToEmit = items.map(({ id }) => id).filter((id) => !savedItems.includes(id));

      const ts = Date.now();
      const promises = idsToEmit.map((id) => async () => {
        if (emit) {
          const { data } = await this.outscraper.getRequestData(id);
          this.$emit(data, {
            id,
            summary: `New task: ${id}`,
            ts,
          });
        }
        savedItems.push(id);
      });

      await Promise.allSettled(promises);
      this._setSavedItems(savedItems);
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessItems(false);
    },
  },
  async run() {
    await this.getAndProcessItems();
  },
};
