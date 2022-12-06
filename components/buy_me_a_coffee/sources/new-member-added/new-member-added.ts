import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "buy_me_a_coffee-new-member-added",
  name: "New Member Added",
  description: "Emit new events when a new member was added. [See the docs](https://developers.buymeacoffee.com/#/apireference?id=members-v1subscriptions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getMembers;
    },
    compareFn(item: any): boolean {
      return this.getLastCreatedTime() < new Date(item.subscription_created_on).getTime();
    },
    getSummary(item: any): string {
      return `New member ${item.payer_name} duration(${item.subscription_duration_type})`;
    },
    getTimeKey(): string {
      return "subscription_created_on";
    },
    getIdKey(): string {
      return "subscription_id";
    },
  },
});
