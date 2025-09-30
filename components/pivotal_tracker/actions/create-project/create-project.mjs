import pivotalTracker from "../../pivotal_tracker.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Create Project",
  key: "pivotal_tracker-create-project",
  description: "Create a new project. [See the docs here](https://www.pivotaltracker.com/help/api/rest/v5#projects_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pivotalTracker,
    name: {
      propDefinition: [
        pivotalTracker,
        "name",
      ],
    },
    description: {
      propDefinition: [
        pivotalTracker,
        "description",
      ],
    },
    projectType: {
      type: "string",
      label: "Project Type",
      description: "The project's type which determines visibility and permissions",
      options: constants.PROJECT_TYPES,
      optional: true,
    },
    enableTasks: {
      type: "boolean",
      label: "Enable Tasks",
      description: "Allow tasks to be added to stories",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      description: this.description,
      project_type: this.projectType,
      enable_tasks: this.enableTasks,
    };

    const response = await this.pivotalTracker.createProject({
      data,
      $,
    });

    $.export("$summary", `Successfully created project with ID ${response.id}`);

    return response;
  },
};
