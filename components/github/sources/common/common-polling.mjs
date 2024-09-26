import github from "../../github.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    _getSavedIds() {
      return this.db.get("savedIds") || [];
    },
    _setSavedIds(value) {
      this.db.set("savedIds", value);
    },
    getItemId(item) {
      return item.id;
    },
    async getAndProcessData(maxEmits = 0) {
      const savedIds = this._getSavedIds();
      const items = await this.getItems();

      items?.filter?.((item) => !savedIds.includes(this.getItemId(item))).forEach((item, index) => {
        if ((!maxEmits) || (index < maxEmits)) {
          this.$emit(item, {
            id: this.getItemId(item),
            ...this.getItemMetadata(item),
          });
        }
        savedIds.push(this.getItemId(item));
      });

      this._setSavedIds(savedIds);
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData(5);
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
