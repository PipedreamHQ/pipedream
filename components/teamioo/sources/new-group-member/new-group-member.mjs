import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "teamioo-new-group-member",
  name: "New Group Member",
  description: "Emit new event when a new member is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.teamioo.listGroupMembers;
    },
    getSummary(item) {
      return `New member added with Id: ${item._id}`;
    },
  },
  sampleEmit,
};
