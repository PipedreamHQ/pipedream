import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "moco-new-invoice-instant",
  name: "New Invoice (Instant)",
  description: "Emit new event when a new invoice is created. [See the documentation](https://everii-group.github.io/mocoapp-api-docs/sections/web_hooks.html#post-accountweb_hooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntityType() {
      return "Invoice";
    },
    getEvent() {
      return "create";
    },
    getSummary(body) {
      return `New Invoice Created: ${body.identifier || body.id}`;
    },
  },
  sampleEmit,
};
