import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "moco-new-time-entry-instant",
  name: "New Time Entry (Instant)",
  description: "Emit new event when a new time entry is created. [See the documentation](https://everii-group.github.io/mocoapp-api-docs/sections/web_hooks.html#post-accountweb_hooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntityType() {
      return "Activity";
    },
    getEvent() {
      return "create";
    },
    getSummary(body) {
      return `New Time Entry Created: ${body.id}`;
    },
  },
  sampleEmit,
};
