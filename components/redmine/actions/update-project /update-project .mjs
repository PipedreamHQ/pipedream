import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-update-project",
  name: "Update Project",
  description: "Updates an existing project in Redmine. [See the documentation](https://www.redmine.org/projects/redmine/wiki/rest_projects#updating-a-project)",
  version: "0.0.1",
  type: "action",
  props: {
    redmine,
    projectId: {
      propDefinition: [
        redmine,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "The identifier of the project",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the project",
      optional: true,
    },
    homepage: {
      type: "string",
      label: "Homepage",
      description: "The homepage of the project",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether the project is public",
      optional: true,
    },
    parentId: {
      propDefinition: [
        redmine,
        "projectId",
      ],
      optional: true,
    },
    inheritMembers: {
      type: "boolean",
      label: "Inherit Members",
      description: "Whether the project should inherit members from its parent",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.redmine.updateProject({
      projectId: this.projectId,
      project: {
        name: this.name,
        identifier: this.identifier,
        description: this.description,
        homepage: this.homepage,
        is_public: this.isPublic,
        parent_id: this.parentId,
        inherit_members: this.inheritMembers,
      },
    });
    $.export("$summary", `Successfully updated project with ID: ${this.projectId}`);
    return response;
  },
};
