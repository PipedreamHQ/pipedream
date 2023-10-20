import qualaroo from "../../qualaroo.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    qualaroo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getOffset() {
      return this.db.get("offset") ?? 0;
    },
    setOffset(offset) {
      this.db.set("offset", offset);
    },
  },
  async run() {
    let offset = this.getOffset();
    const limit = constants.MAX_LIMIT;
    const data = [];

    const {
      fn,
      opts,
    } = this.getListingFunctionOpts();

    while (true) {
      const response = await fn.call(this, {
        ...opts,
        params: {
          ...opts.params,
          limit,
          offset,
        },
      });

      if (response.length === 0) {
        break;
      }

      offset += limit;
      this.setOffset(offset);
      data.push(...response);
    }

    for (const event of data) {
      this.$emit(event, this.getMeta(event));
    }
  },
};
