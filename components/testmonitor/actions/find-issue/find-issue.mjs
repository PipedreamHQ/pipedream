import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-find-issue",
  name: "Find an Issue",
  description: "Retrieve an issue using its identifier. [See the docs here](https://docs.testmonitor.com/#tag/Issues/operation/GetIssue)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    issueId: {
      propDefinition: [
        common.props.testmonitor,
        "issueId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  methods: {
    async processEvent($) {
      const { issueId } = this;
      return this.testmonitor.getIssue({
        $,
        issueId,
      });
    },
    getSummary({
      data: {
        id, name,
      },
    }) {
      return `Issue (${name ?? id}) successfully fetched!`;
    },
  },
};
