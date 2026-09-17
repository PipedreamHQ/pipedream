import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-task-assignments",
  name: "List Task Assignments",
  description: `List task assignments, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS}. Omit Project ID to use the global endpoint; provide a Project ID to list assignments for a single project. Example: call with projectId set to the Jurassic Park Construction project's ID to see which tasks are billable on it. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
      description: "Optional free-form project ID, e.g. `14308069`. When set, routes to the per-project endpoint `/projects/{project_id}/task_assignments`; when omitted uses the global `/task_assignments`. Run **Get Projects** first to find valid IDs.",
      optional: true,
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Only return active or inactive task assignments.",
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
  },
  async run({ $ }) {
    const assignments = [];
    const pages = this.harvest.listTaskAssignmentsPaginated({
      page: 1,
      projectId: this.projectId,
      accountId: this.accountId,
      is_active: this.isActive,
      updated_since: this.updatedSince,
    });
    for await (const assignment of pages) {
      assignments.push(assignment);
      if (assignments.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = assignments.length;
    $.export("$summary", `Successfully retrieved ${count} task assignment${count === 1
      ? ""
      : "s"}`);
    return assignments;
  },
};
