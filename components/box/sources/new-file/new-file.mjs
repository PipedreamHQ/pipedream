import common from "../common/common.mjs";

export default {
  key: "box-new-file",
  name: "New File Event",
  description: "Emit new event when a new file uploaded on a target, [See the docs](https://developer.box.com/reference/post-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "FILE.UPLOADED",
      ];
    },
    getSummary(event) {
      return  `New file uploaded event with ID(${event.id})`;
    },
  },
};
