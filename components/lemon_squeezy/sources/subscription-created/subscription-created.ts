import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "lemon_squeezy-subscription-created",
  name: "New Subscription Created",
  description: "Emit new event when a new subscription is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.lemonSqueezy.listSubscriptions;
    },
    getSummary({ id }): string {
      return `A new subscription with id ${id} was created!`;
    },
  },
});
