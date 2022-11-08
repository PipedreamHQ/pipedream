import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "buy_me_a_coffee-new-item-purchased",
  name: "New Item Purchased",
  description: "Emit new events when a new item was purchased. [See the docs](https://developers.buymeacoffee.com/#/apireference?id=extra-purchases-v1extras)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getPurchases;
    },
    compareFn(item: any): boolean {
      return this.getLastCreatedTime() < new Date(item.purchased_on).getTime();
    },
    getSummary(item: any): string {
      return `New purchase ${item.purchase_question} amount(${item.purchase_amount})`;
    },
    getTimeKey(): string {
      return "purchased_on";
    },
    getIdKey(): string {
      return "purchase_id";
    },
  },
});
