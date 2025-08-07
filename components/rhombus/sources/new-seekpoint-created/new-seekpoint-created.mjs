import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "rhombus-new-seekpoint-created",
  name: "New Seekpoint Created",
  description: "Emit new event when a new seekpoint is created. [See the documentation](https://apidocs.rhombus.com/reference/getauditfeed)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "CREATE_SEEKPOINT",
      ];
    },
  },
};
