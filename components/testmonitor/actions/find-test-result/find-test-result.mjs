import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-find-test-result",
  name: "Find a Test Result",
  description: "Retrieve a list of test results. [See the docs here](https://docs.testmonitor.com/#tag/Test-Results/operation/GetTestResultCollection)",
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
      options: constants.TEST_RESULT_OPTIONS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.testmonitor.getTestResults;
    },
    getSummary() {
      return "Test Results successfully fetched!";
    },
  },
};
