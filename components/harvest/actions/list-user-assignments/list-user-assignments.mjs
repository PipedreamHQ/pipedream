import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-user-assignments",
  name: "List User Assignments",
  description: `List user assignments, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS}. Omit Project ID to use the global endpoint; provide a Project ID to list assignments for a single project. Example: call with projectId set to the Isla Sorna Genetics Lab project's ID to see who is staffed on it. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/).`,
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
      description: "Optional free-form project ID, e.g. `14308069`. When set, routes to `/projects/{project_id}/user_assignments`; when omitted uses global `/user_assignments`. Run **Get Projects** first to find valid IDs.",
      optional: true,
    },
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
      description: "Free-form user ID filter, applies whether using the global `/user_assignments` endpoint or a project-scoped `/projects/{project_id}/user_assignments` endpoint, e.g. `1782959`. Run **List Users** first to find valid IDs.",
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Only return active or inactive user assignments.",
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
    const pages = this.harvest.listUserAssignmentsPaginated({
      page: 1,
      $,
      projectId: this.projectId,
      accountId: this.accountId,
      user_id: this.userId,
      is_active: this.isActive,
      updated_since: this.updatedSince,
    });
    for await (const assignment of pages) {
      assignments.push(assignment);
      if (assignments.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = assignments.length;
    $.export("$summary", `Successfully retrieved ${count} user assignment${count === 1
      ? ""
      : "s"}`);
    return assignments;
  },
};
