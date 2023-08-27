import app from "../../outseta.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
  },
  methods: {
    getLastCreated() {
      return this.db.get("lastCreated");
    },
    setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    listingFn() {
      throw new Error("listingFn is not implemented");
    },
    getMeta() {
      throw new Error("getMeta is not implemented");
    },
  },
  async run({ $ }) {
    let { items } = await this.listingFn($);
    const lastCreated = this.getLastCreated();
    if (lastCreated) {
      items = items.filter((item) => +new Date(item.Created) > +new Date(lastCreated));
    }
    for (const item of items.reverse()) {
      this.$emit(item, this.getMeta(item));
      this.setLastCreated(item.Created);
    }
  },
};
