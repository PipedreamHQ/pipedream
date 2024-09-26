import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../qntrl.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData(false);
    },
  },
  methods: {
    _getSavedIds() {
      return this.db.get("savedIds") ?? [];
    },
    _setSavedIds(value) {
      this.db.set("savedIds", value);
    },
    getItemId(item) {
      return item.id;
    },
    async getAndProcessData(emit = true) {
      const savedIds = this._getSavedIds();
      const items = await this.getItems();
      const ts = Date.now();
      items?.filter((item) => !savedIds.includes(this.getItemId(item))).sort(this.sortItems)
        .forEach((item) => {
          const id = this.getItemId(item);
          if (emit) {
            this.$emit(item, {
              id,
              summary: this.getSummary(item),
              ts,
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
