import common from "../common/base.mjs";

export default {
  ...common,
  key: "plainly-new-render-failed",
  name: "New Render Failed",
  description: "Emit new event when a video render fails.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.plainly,
        "projectId",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        common.props.plainly,
        "templateId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.plainly.listRenders;
    },
    getArgs() {
      return {
        params: {
          projectId: this.projectId,
          templateId: this.templateId,
          state: "FAILED",
        },
      };
    },
    getTsField() {
      return "lastModified";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Failed Render with ID: ${item.id}`,
        ts: Date.parse(item.lastModified),
      };
    },
  },
};
