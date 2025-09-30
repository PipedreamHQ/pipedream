import testmo from "../../testmo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "testmo-append-to-automation-run",
  name: "Append to Automation Run",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Appends test artifacts, fields or links to an existing automation run. [See the documentation](https://docs.testmo.com/api/reference/automation-runs#post-automation-runs-automation_run_id-append)",
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
    artifacts: {
      propDefinition: [
        testmo,
        "artifacts",
      ],
    },
    links: {
      type: "string[]",
      label: "Links",
      description: "List of links to attach to the automation run (such as a link back to the build in the CI tool that triggered the tests).",
      optional: true,
    },
    numFields: {
      type: "integer",
      label: "Number of Fields",
      description: "Number of fields to enter name, type, and value for",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    for (let i = 1; i <= this.numFields; i++) {
      props[`name_${i}`] = {
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
    return props;
  },
  async run({ $ }) {
    const artifacts = this.artifacts?.map((artifact) => ({
      name: artifact,
      url: artifact,
    }));
    const links = this.links?.map((link) => ({
      name: link,
      url: link,
    }));
    const fields = [];
    for (let i = 1; i <= this.numFields; i++) {
      fields.push({
        name: this[`name_${i}`],
        type: this[`type_${i}`],
        value: this[`value_${i}`],
      });
    }

    const response = await this.testmo.appendToAutomationRun({
      automationRunId: this.automationRunId,
      data: {
        artifacts,
        links,
        fields,
      },
      $,
    });

    $.export("$summary", `Successfully appended data to automation run with ID ${this.automationRunId}.`);

    return response;
  },
};
