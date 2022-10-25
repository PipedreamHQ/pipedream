import { defineSource } from "@pipedream/types";
import { Transaction } from "../../common/responseSchemas";
import common from "../common";

export default defineSource({
  ...common,
  name: "New Payment",
  description:
    "Emit new event for each new **payment** [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getTransactionUsingGET)",
  key: "infusionsoft-new-payment",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getHookType(): string {
      return "invoice.payment.add";
    },
    getSummary({
      amount, order_ids,
    }: Transaction): string {
      return `${amount} for orders ${order_ids}`;
    },
  },
});
