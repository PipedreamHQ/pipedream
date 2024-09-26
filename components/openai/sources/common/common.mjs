import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import openai from "../../openai.app.mjs";

export default {
  props: {
    openai,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getMeta() {
      throw new Error("No item metadata implemented!");
    },
    async getData() {
      throw new Error("No item fetching implemented!");
    },
    async getAndProcessItems(maxEvents) {
      const lastCreated = this._getLastCreated();
      const { data } = await this.getData();
      if (!data?.length) {
        return;
      }
      this._setLastCreated(data[0].created_at);
      data
        ?.filter(({ created_at }) => created_at >= lastCreated)
        .reverse()
        .forEach((item, index) => {
          if (!maxEvents || index < maxEvents) {
            this.$emit(item, this.getMeta(item));
          }
        });
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessItems(10);
    },
  },
  async run() {
    await this.getAndProcessItems();
  },
};
