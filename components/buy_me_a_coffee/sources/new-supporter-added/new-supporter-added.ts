import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "buy_me_a_coffee-new-supporter-added",
  name: "New Supporter Added",
  description: "Emit new events when a new supporter was added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getSupporters;
    },
    compareFn(item: any): boolean {
      return this.getLastCreatedTime() < new Date(item.support_created_on).getTime();
    },
    getSummary(item: any): string {
      return `New supporter ${item.payer_name} note(${item.support_note})`;
    },
    getTimeKey(): string {
      return "support_created_on";
    },
    getIdKey(): string {
      return "support_id";
    },
  },
});
