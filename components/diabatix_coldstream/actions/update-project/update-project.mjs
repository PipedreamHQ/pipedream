import coldstream from "../../diabatix_coldstream.app.mjs";

export default {
  key: "diabatix_coldstream-update-project",
  name: "Update Project in ColdStream",
  description: "Updates an existing project with new parameters or data in ColdStream. [See the documentation](https://coldstream.readme.io/reference/put_projects-projectid)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coldstream,
    organizationId: {
      propDefinition: [
        coldstream,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        coldstream,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the project",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The new description for the project",
    },
  },
  async run({ $ }) {
    const response = await this.coldstream.updateProject({
      $,
      projectId: this.projectId,
      data: {
        name: this.name,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully updated project with ID ${this.projectId}`);
    return response;
  },
};
