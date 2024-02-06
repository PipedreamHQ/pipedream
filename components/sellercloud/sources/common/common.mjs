import sellercloud from "../../sellercloud.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    sellercloud,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    async paginateEvents({
      resourceFn, params, processParams,
    }) {
      const pageSize = constants.DEFAULT_PAGE_SIZE;
      params = {
        ...params,
        pageSize,
        pageNumber: 1,
      };
      let total = 0;

      do {
        const { Items: items } = await resourceFn({
          params,
        });
        this.processEvents(items, processParams);
        total = items?.length;
        params.pageNumber += 1;
      } while (total === pageSize);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvents() {
      throw new Error("processEvents is not implemented");
    },
  },
};
