import squarespace from "../../squarespace.app.mjs";
import dayjs from "dayjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Create Product",
  version: "0.0.3",
  key: "squarespace-new-create-product",
  description: "Emit new event for each product created.",
  type: "source",
  dedupe: "unique",
  props: {
    squarespace,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run({ $ }) {
    const products = await this.squarespace.getProducts({
      params: {
        modifiedAfter: dayjs().subtract(2, "day")
          .toISOString(),
      },
      $,
    });

    for (const product of products) {
      this.$emit(product, {
        id: product.id,
        summary: `New product ${product.id} created`,
        ts: Date.parse(product.createdOn),
      });
    }
  },
};
