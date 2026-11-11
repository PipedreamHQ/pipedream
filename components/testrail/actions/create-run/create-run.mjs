import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-run",
  name: "Create Run",
  description: "Create a test run in a TestRail project, containing all cases of a suite or just selected ones. Use **List Projects** for `projectId` and, in multi-suite projects (`suite_mode` 3), **List Suites** for `suiteId` (REQUIRED there, otherwise TestRail rejects the call). Pass `caseIds` (from **List Cases**) to run only a subset; omit it to include every case. After creating, record outcomes with **Add Result** / **Add Results For Cases** and finish with **Close Run**. Example: projectId=412, suiteId=8731, runName=\"Nightly Regression 2025-03-01\" → returns {id: 91, name, suite_id: 31, url}. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Runs#addrun)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    runName: {
      type: "string",
      label: "Name",
      description: "Run name.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional run description.",
      optional: true,
    },
    caseIds: {
      type: "integer[]",
      label: "Case IDs",
      description: "Only include these cases (ids from **List Cases**). Omit to include all cases in the suite.",
      optional: true,
    },
    milestoneId: {
      type: "integer",
      label: "Milestone ID",
      description: "Optional milestone id to attach the run to.",
      optional: true,
    },
    assignedToId: {
      type: "integer",
      label: "Assign To (User ID)",
      description: "Optional default assignee. Use **Get User**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasCases = this.caseIds?.length > 0;
    const response = await this.app.addRun({
      $,
      projectId: this.projectId,
      data: {
        suite_id: this.suiteId,
        name: this.runName,
        description: this.description,
        milestone_id: this.milestoneId,
        assignedto_id: this.assignedToId,
        include_all: !hasCases,
        case_ids: hasCases
          ? this.caseIds
          : undefined,
      },
    });
    $.export("$summary", `Created run ${response.id}: ${response.name}`);
    return response;
  },
};
