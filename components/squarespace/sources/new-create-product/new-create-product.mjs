import squarespace from "../../squarespace.app.mjs";
import dayjs from "dayjs";

export default {
  name: "New Create Product",
  version: "0.0.1",
  key: "squarespace-new-create-product",
  description: "Emit new event for each product created.",
  type: "source",
  dedupe: "unique",
  props: {
    squarespace,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
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
