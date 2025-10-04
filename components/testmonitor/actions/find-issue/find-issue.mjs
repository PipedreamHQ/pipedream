import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-find-issue",
  name: "Find an Issue",
  description: "Retrieve a list of issues. [See the docs here](https://docs.testmonitor.com/#tag/Issues/operation/GetIssueCollection)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.testmonitor,
        "projectId",
      ],
    },
    withProp: {
      propDefinition: [
        common.props.testmonitor,
        "with",
      ],
      options: constants.ISSUE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.testmonitor.getIssues;
    },
    getSummary() {
      return "Issues successfully fetched!";
    },
  },
};
