import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "rhombus-new-camera-clip-created",
  name: "New Camera Clip Created",
  description: "Emit new event when a new clip is created. [See the documentation](https://apidocs.rhombus.com/reference/getauditfeed)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "SAVED_CLIP_CREATE",
      ];
    },
  },
};
