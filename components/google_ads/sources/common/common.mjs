import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import props from "../../common/props.mjs";

export default {
  props: {
    ...props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData(5);
    },
  },
  methods: {
    _getSavedIds() {
      return this.db.get("savedIds") ?? [];
    },
    _setSavedIds(value) {
      this.db.set("savedIds", value);
    },
    getTimestamp() {
      return Date.now();
    },
    getItemId({ id }) {
      return id;
    },
    async getAndProcessData(max = 0) {
      const savedIds = this._getSavedIds();
      const items = await this.getItems(savedIds);
      items?.filter((item) => !savedIds.includes(this.getItemId(item)))
        .forEach((item, index) => {
          const id = this.getItemId(item);
          if (!max || index < max) {
            this.$emit(item, {
              id,
              summary: this.getSummary(item),
              ts: this.getTimestamp(item),
            });
          }
          savedIds.push(id);
        });
      this._setSavedIds(savedIds);
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
