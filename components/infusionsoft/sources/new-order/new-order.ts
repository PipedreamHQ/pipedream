import { defineSource } from "@pipedream/types";
import { Order } from "../../types/responseSchemas";
import common from "../common";

export default defineSource({
  ...common,
  name: "New Order",
  description:
    "Emit new event for each new **order** [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getOrderUsingGET)",
  key: "infusionsoft-new-order",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookType(): string {
      return "order.add";
    },
    getSummary(order: Order): string {
      return this.infusionsoft.getOrderSummary(order);
    },
  },
});
