import { ConfigurationError } from "@pipedream/platform";
import testmonitor from "../../testmonitor.app.mjs";

export default {
  key: "testmonitor-create-test-result",
  name: "Create Test Result",
  description: "Create a new test result. [See the docs here](https://docs.testmonitor.com/#tag/Test-Results/operation/PostTestResult)",
  version: "0.0.1",
  type: "action",
  props: {
    testmonitor,
    projectId: {
      propDefinition: [
        testmonitor,
        "projectId",
      ],
    },
    testCaseId: {
      propDefinition: [
        testmonitor,
        "testCaseId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    testRunId: {
      propDefinition: [
        testmonitor,
        "testRunId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "Denotes if this test result is marked as draft.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the test result.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.testmonitor.createTestResult({
        $,
        data: {
          test_case_id: this.testCaseId,
          test_run_id: this.testRunId,
          draft: this.draft,
          description: this.description,
        },
      });

      $.export("$summary", `Successfully created test result with Id: ${response.data.id}`);
      return response;
    } catch (e) {
      throw new ConfigurationError((e.response.status === 400)
        ? "It seems that there is already a test with this configuration!"
        : e.response.data.message);
    }
  },
};
