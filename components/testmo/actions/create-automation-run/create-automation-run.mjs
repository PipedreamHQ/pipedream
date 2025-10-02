import { parseArray } from "../../common/utils.mjs";
import testmo from "../../testmo.app.mjs";

export default {
  key: "testmo-create-automation-run",
  name: "Create Automation Run",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new automation run in a target project in preparation for adding threads and test results. [See the documentation](https://docs.testmo.com/api/reference/automation-runs#post-projects-project_id-automation-runs)",
  type: "action",
  props: {
    testmo,
    projectId: {
      propDefinition: [
        testmo,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new automation run.",
    },
    source: {
      propDefinition: [
        testmo,
        "source",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    config: {
      type: "string",
      label: "Config",
      description: "Name of the configuration for the new automation run.",
      optional: true,
    },
    configId: {
      type: "string",
      label: "Config Id",
      description: "ID of the configuration for the new automation run. If both config and `configId` are specified, `configId` is given precedence.",
      optional: true,
    },
    milestone: {
      type: "string",
      label: "Milestone",
      description: "Name of the milestone for the new automation run.",
      optional: true,
    },
    milestoneId: {
      propDefinition: [
        testmo,
        "milestoneId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags for the new automation run. If a milestone in the same project has one or more matching automation tags, the new automation run is automatically linked to that milestone (unless `milestone` or `milestoneId` is also specified).",
      optional: true,
    },
    artifacts: {
      type: "string[]",
      label: "Artifacts",
      description: "List of externally stored test artifacts to link to the new automation run (such as log files, screenshots or test data). [See de documentation for details](https://docs.testmo.com/api/reference/automation-runs#post-projects-project_id-automation-runs)",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "List of fields to attach to the new automation run (such as environment variables, errors or terminal output). [See de documentation for details](https://docs.testmo.com/api/reference/automation-runs#post-projects-project_id-automation-runs)",
      optional: true,
    },
    links: {
      type: "string[]",
      label: "Links",
      description: "List of links to attach to the new automation run (such as a link back to the build in the CI tool that triggered the tests). [See de documentation for details](https://docs.testmo.com/api/reference/automation-runs#post-projects-project_id-automation-runs)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      testmo,
      projectId,
      configId,
      milestoneId,
      artifacts,
      fields,
      links,
      ...data
    } = this;

    const response = await testmo.createAutomationRun({
      $,
      projectId,
      data: {
        config_id: configId,
        milestone_id: milestoneId,
        artifacts: parseArray(artifacts),
        fields: parseArray(fields),
        links: parseArray(links),
        ...data,
      },
    });

    $.export("$summary", `A new automation run with Id: ${response.id} was successfully created!`);
    return response;
  },
};
