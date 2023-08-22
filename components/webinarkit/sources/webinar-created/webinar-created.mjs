import common from "../common/polling.mjs";

export default {
  ...common,
  key: "webinarkit-webinar-created",
  name: "Webinar Created",
  description: "Triggered when a new webinar is created. [See the documentation](https://documenter.getpostman.com/view/6125750/UyrDEFnd#b6db56e1-2767-499e-9928-38c82f3bd3e6)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "results";
    },
    getResourceFn() {
      return this.app.listWebinars;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Webinar: ${resource.name}`,
        ts: Date.now(),
      };
    },
  },
};
