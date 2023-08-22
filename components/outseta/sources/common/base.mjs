import app from "../../outseta.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    listingFn() {
      throw new Error("listingFn is not implemented");
    },
    getMeta() {
      throw new Error("getMeta is not implemented");
    },
  },
  async run({ $ }) {
    const { items } = await this.listingFn($);
    for (const item of items.reverse()) {
      this.$emit(item, this.getMeta(item));
    }
  },
};
