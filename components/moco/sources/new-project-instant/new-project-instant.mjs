import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "moco-new-project-instant",
  name: "New Project (Instant)",
  description: "Emit new event when a new project is created. [See the documentation](https://everii-group.github.io/mocoapp-api-docs/sections/web_hooks.html#post-accountweb_hooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntityType() {
      return "Project";
    },
    getEvent() {
      return "create";
    },
    getSummary(body) {
      return `New Project Created: ${body.name || body.id}`;
    },
  },
  sampleEmit,
};
