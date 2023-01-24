import common from "../common/base.mjs";

export default {
  ...common,
  key: "reply_io-new-reply-categorized",
  name: "New Reply Categorized (Instant)",
  description: "Emit new event when a reply is marked with a new inbox category. If an uncategorized category is assigned, the webhook will not be triggered. [See the docs here](https://apidocs.reply.io/#84947c50-24b8-411c-bb71-d6cddf49fc16)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "reply_categorized";
    },
  },
};
