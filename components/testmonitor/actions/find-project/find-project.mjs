import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-find-project",
  name: "Find a Project",
  description: "Retrieve a project using its identifier. [See the docs here](https://docs.testmonitor.com/#tag/Projects/operation/GetProject)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
  },
  methods: {
    async processEvent($) {
      const { projectId } = this;
      return this.testmonitor.getProject({
        $,
        projectId,
      });
    },
    getSummary({
      data: {
        id, name,
      },
    }) {
      return `Project (${name ?? id}) successfully fetched!`;
    },
  },
};
