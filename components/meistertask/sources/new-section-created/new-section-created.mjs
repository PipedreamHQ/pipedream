import common from "../common/base.mjs";

export default {
  ...common,
  key: "meistertask-new-section-created",
  name: "New Section Created",
  description: "Emit new event when a new section is created. [See the docs](https://developers.meistertask.com/reference/get-sections)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.meistertask,
        "projectId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.projectId
        ? this.meistertask.listProjectSections
        : this.meistertask.listSections;
    },
    getArgs() {
      const params = {
        sort: "-created_at",
      };
      return this.projectId
        ? {
          projectId: this.projectId,
          params,
        }
        : {
          params,
        };
    },
    generateMeta(section) {
      return {
        id: section.id,
        summary: section.name,
        ts: Date.parse(section.created_at),
      };
    },
  },
};
