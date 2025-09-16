import { buildProjectData } from "../../common/utils.mjs";
import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-update-project",
  name: "Update Project",
  description: "Update an existing project in Taiga. [See the documentation](https://docs.taiga.io/api.html#_projects)",
  version: "0.0.1",
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The project name",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The project description",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The project slug (URL-friendly name)",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Private",
      description: "Whether the project should be private",
      optional: true,
    },
    owner: {
      propDefinition: [
        taiga,
        "userId",
      ],
      label: "Owner",
      description: "User to set as project owner",
      optional: true,
    },
  },
  async run({ $ }) {
    const projectData = buildProjectData({
      name: this.name,
      description: this.description,
      slug: this.slug,
      is_private: this.isPrivate,
      owner: this.owner,
    });

    const response = await this.taiga.updateProject(this.projectId, projectData);

    $.export("$summary", `Updated project: ${response.name}`);
    return response;
  },
};
