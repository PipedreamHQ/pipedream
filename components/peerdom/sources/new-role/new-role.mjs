import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "peerdom-new-role",
  name: "New Role Created",
  description: "Emit new event when a new role is created in a circle. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.peerdom.listRoles;
    },
    getSummary(item) {
      return `New Role Created: ${item.name}`;
    },
    sortItems(items) {
      return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
  },
  sampleEmit,
};
