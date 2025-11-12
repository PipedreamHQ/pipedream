import copper from "../../copper.app.mjs";

export default {
  key: "copper-create-update-project",
  name: "Create or Update Project",
  description: "Creates a new project or updates an existing one based on the project name. [See the documentation](https://developer.copper.com/projects/create-a-new-project.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    copper,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project. If a project with the specified name already exists, it will be updated",
    },
    details: {
      type: "string",
      label: "Details",
      description: "Description of the Project",
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        copper,
        "objectId",
        () => ({
          objectType: "users",
        }),
      ],
      label: "Assignee ID",
      description: "The ID of the User that will be the owner of the Project",
      optional: true,
    },
    status: {
      propDefinition: [
        copper,
        "status",
      ],
    },
    tags: {
      propDefinition: [
        copper,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    let response;
    const data = {
      name: this.name,
      assignee_id: this.assigneeId,
      status: this.status,
      tags: this.tags,
    };

    // search for the project
    const project = await this.copper.listObjects({
      $,
      objectType: "projects",
      data: {
        name: this.name,
      },
    });

    // create project if not found
    if (!project?.length) {
      response = await this.copper.createProject({
        $,
        data,
      });
    }
    // update project if found
    else {
      response = await this.copper.updateProject({
        $,
        projectId: project[0].id,
        data,
      });
    }

    $.export("$summary", `Successfully ${project?.length
      ? "updated"
      : "created"} project with ID: ${response.id}`);
    return response;
  },
};
