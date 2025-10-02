import testmo from "../../testmo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "testmo-append-to-thread",
  name: "Append to Thread in Automation Run",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Appends test artifacts, fields or test results to an existing thread in an automation run. [See the documentation](https://docs.testmo.com/api/reference/automation-runs#post-automation-runs-threads-automation_run_thread_id-append)",
  type: "action",
  props: {
    testmo,
    projectId: {
      propDefinition: [
        testmo,
        "projectId",
      ],
    },
    automationRunId: {
      propDefinition: [
        testmo,
        "automationRunId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    threadId: {
      propDefinition: [
        testmo,
        "threadId",
        (c) => ({
          automationRunId: c.automationRunId,
        }),
      ],
    },
    elapsedObserved: {
      type: "integer",
      label: "Elapsed Observed",
      description: "Partial observed elapsed (execution time) in microseconds to add to the overall observed time of the thread.",
      optional: true,
    },
    artifacts: {
      propDefinition: [
        testmo,
        "artifacts",
      ],
    },
    numFields: {
      type: "integer",
      label: "Number of Fields",
      description: "Number of fields to append",
      optional: true,
      reloadProps: true,
    },
    numTests: {
      type: "integer",
      label: "Number of Tests",
      description: "Number of tests to append",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.numFields) {
      for (let i = 1; i <= this.numFields; i++) {
        props[`fieldName_${i}`] = {
          type: "string",
          label: `Field ${i} - Name`,
        };
        props[`type_${i}`] = {
          type: "integer",
          label: `Field ${i} - Type`,
          options: constants.FIELD_TYPES,
        };
        props[`value_${i}`] = {
          type: "string",
          label: `Field ${i} - Value`,
          optional: true,
        };
      }
    }
    if (this.numTests) {
      for (let i = 1; i <= this.numTests; i++) {
        props[`key_${i}`] = {
          type: "string",
          label: `Test ${i} - Key`,
          description: "Key used to identify tests across multiple automation runs (in the context of the same source)",
        };
        props[`testName_${i}`] = {
          type: "string",
          label: `Test ${i} - Name`,
          description: "Name of the test",
        };
        props[`status_${i}`] = {
          type: "string",
          label: `Test ${i} - Status`,
          description: "Alias of the status for the result of the test (for example, `failed` or `passed`). The status aliases can be configured in Testmo's admin area.",
        };
        props[`folder_${i}`] = {
          type: "string",
          label: `Test ${i} - Folder`,
          description: "Fully qualified name of the target folder of the test. Folders can be used to group related tests and usually map to class or type names as defined in the test automation suite",
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const artifacts = this.artifacts?.map((artifact) => ({
      name: artifact,
      url: artifact,
    }));
    const fields = [];
    for (let i = 1; i <= this.numFields; i++) {
      fields.push({
        name: this[`fieldName_${i}`],
        type: this[`type_${i}`],
        value: this[`value_${i}`],
      });
    }
    const tests = [];
    for (let i = 1; i <= this.numTests; i++) {
      tests.push({
        key: this[`key_${i}`],
        name: this[`testName_${i}`],
        status: this[`status_${i}`],
        folder: this[`folder_${i}`],
      });
    }

    const response = await this.testmo.appendToThread({
      threadId: this.threadId,
      data: {
        elapsed_observed: this.elapsedObserved,
        artifacts,
        fields,
        tests,
      },
      $,
    });

    $.export("$summary", `Successfully appended data to automation run thread with ID ${this.threadId}.`);

    return response;
  },
};
