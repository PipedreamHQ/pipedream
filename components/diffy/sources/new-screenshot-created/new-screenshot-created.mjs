import common from "../common/base.mjs";

export default {
  ...common,
  key: "diffy-new-screenshot-created",
  name: "New Screenshot Created",
  description: "Emit new event when a new screenshot is created in Diffy. [See the documentation](https://app.diffy.website/rest#/Projects/get_projects__id__screenshots)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.diffy.listScreenshots;
    },
    getArgs() {
      return {
        projectId: this.projectId,
      };
    },
    getResourceType() {
      return "screenshots";
    },
    getTsField() {
      return "date";
    },
    generateMeta(screenshot) {
      return {
        id: screenshot.id,
        summary: `New screenshot ${screenshot.id}`,
        ts: screenshot.date,
      };
    },
  },
};
