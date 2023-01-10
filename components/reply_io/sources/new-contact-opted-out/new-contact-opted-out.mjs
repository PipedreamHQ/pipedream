import common from "../common/base.mjs";

export default {
  ...common,
  key: "reply_io-new-contact-opted-out",
  name: "New Contact Opted Out (Instant)",
  description: "Emit new event when a person opts out. [See the docs here](https://apidocs.reply.io/#84947c50-24b8-411c-bb71-d6cddf49fc16)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "contact_opted_out";
    },
  },
};
