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
    _getSavedItems() {
      return this.db.get("savedItems") ?? [];
    },
    _setSavedItems(value) {
      this.db.set("savedItems", value);
    },
    getMeta() {
      throw new Error("No item metadata implemented!");
    },
    async getData() {
      throw new Error("No item fetching implemented!");
    },
    async getAndProcessItems(maxEvents) {
      const savedItems = this._getSavedItems();
      const { data } = await this.getData();
      data
        ?.filter(({ id }) => !savedItems.includes(id))
        .reverse()
        .forEach((item, index) => {
          if (!maxEvents || index < maxEvents) {
            this.$emit(item, this.getMeta(item));
          }
          savedItems.push(item.id);
        });
      this._setSavedItems(savedItems);
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessItems();
    },
  },
  async run() {
    await this.getAndProcessItems(10);
  },
};
