import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-create-task",
  name: "Create Task",
  description: "Creates a task. [See the docs here](https://www.zoho.com/projects/help/rest-api/tasks-api.html#alink4)",
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
      description: "Name of the task.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      projectId,
      name,
      description,
    } = this;

    const { tasks } =
      await this.zohoProjects.createTask({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        projectId,
        data: {
          name,
          description,
        },
      });

    const task = tasks[0];

    $.export("$summary", `Successfully created a new task with ID ${task.id_string}`);

    return task;
  },
};
