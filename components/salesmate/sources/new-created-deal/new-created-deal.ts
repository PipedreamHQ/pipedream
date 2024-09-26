import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "salesmate-new-created-deal",
  name: "New Deal",
  description: "Emit new event when a new deal is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.salesmate.listDeals;
    },
    getSummary({ id }): string {
      return `A new deal with id ${id} was created!`;
    },
  },
});
