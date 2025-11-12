import common from "../common/common.mjs";

export default {
  key: "box-new-folder",
  name: "New Folder Event",
  description: "Emit new event when a new folder created on a target. [See the documentation](https://developer.box.com/reference/post-webhooks)",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "FOLDER.CREATED",
      ];
    },
    getSummary(event) {
      return  `New folder created event with ID(${event.id})`;
    },
  },
};
