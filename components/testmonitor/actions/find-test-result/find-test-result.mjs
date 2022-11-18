import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-find-test-result",
  name: "Find a Test Result",
  description: "Retrieve a test result using its identifier. [See the docs here](https://docs.testmonitor.com/#tag/Test-Results/operation/GetTestResult)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    testResultId: {
      propDefinition: [
        common.props.testmonitor,
        "testResultId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  methods: {
    async processEvent($) {
      const { testResultId } = this;
      return this.testmonitor.getTestResult({
        $,
        testResultId,
      });
    },
    getSummary({
      data: {
        id, code,
      },
    }) {
      return `Test Result (${code ?? id}) successfully fetched!`;
    },
  },
};
