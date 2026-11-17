import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-run",
  name: "Create Run",
  description: "Creates a test run in a TestRail project, either with all cases of a suite or with a chosen list of cases. Use it to start a new round of testing before recording results. To close a finished run use **Close Run**; to find existing runs use **List Runs**. In a multiple-suite project (suite_mode 3) `suiteId` is required. Returns the new run's id, name, suite_id, url and per-status counts. Example: projectId=\"Isla Nublar Test Lab\", suiteId=15, name=\"Nightly Containment Build 215\" → run with all suite cases untested. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    runName: {
      type: "string",
      label: "Name",
      description: "Name of the run, e.g. `Nightly Containment Build 215`.",
    },
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the run.",
      optional: true,
    },
    milestoneId: {
      type: "integer",
      label: "Milestone ID",
      description: "Attach the run to this milestone.",
      optional: true,
    },
    assignedtoId: {
      type: "integer",
      label: "Assign To User ID",
      description: "Assign the run to this user. Use **List Users** to find the ID.",
      optional: true,
    },
    includeAll: {
      type: "boolean",
      label: "Include All Cases",
      description: "True (the default) adds every case of the suite. Set false and pass `caseIds` to select cases.",
      default: true,
      optional: true,
    },
    caseIds: {
      type: "integer[]",
      label: "Case IDs",
      description: "Case IDs to include. Only used when `includeAll` is false. Use **List Cases** to find them.",
      optional: true,
    },
  },
  async run({ $ }) {
    const projectId = await this.app.resolveProjectId($, this.projectId);
    const includeAll = this.includeAll !== false;
    if (!includeAll && !this.caseIds?.length) {
      throw new Error("caseIds is required when includeAll is false");
    }
    const run = await this.app.post({
      $,
      path: `add_run/${projectId}`,
      data: {
        ...this.app.cleanParams({
          name: this.runName,
          suite_id: this.suiteId,
          description: this.description,
          milestone_id: this.milestoneId,
          assignedto_id: this.assignedtoId,
        }),
        include_all: includeAll,
        ...(includeAll
          ? {}
          : {
            case_ids: this.caseIds,
          }),
      },
    });
    $.export("$summary", `Created run ${run.id}: ${run.name}`);
    return {
      id: run.id,
      name: run.name,
      suite_id: run.suite_id,
      url: run.url,
      untested_count: run.untested_count,
    };
  },
};
