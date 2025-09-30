import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-create-task-list",
  name: "Create Task List",
  description: "Creates a task list. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasklists-api.html#alink2)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoProjects,
    portalId: {
      propDefinition: [
        zohoProjects,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the task list.",
    },
    flag: {
      type: "string",
      label: "Flag",
      description: "Task list flag must be `internal` or `external`. Not mandatory when task list template is used.",
      options: [
        "internal",
        "external",
      ],
    },
  },
  async run({ $ }) {
    const {
      portalId,
      projectId,
      name,
      flag,
    } = this;

    const { tasklists } =
      await this.zohoProjects.createTaskList({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        projectId,
        data: {
          name,
          flag,
        },
      });

    const tasklist = tasklists[0];

    $.export("$summary", `Successfully created a new task list with ID ${tasklist.id_string}`);

    return tasklist;
  },
};
