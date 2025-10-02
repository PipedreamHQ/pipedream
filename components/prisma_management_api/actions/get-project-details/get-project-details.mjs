import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Get Project details",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prisma_management_api-get-project-details",
  description: "Get project details of a particular project in Prisma Workspace via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to retrieve information for",
    },
  },
  async run({ $ }) {
    const response = await this.app.getProject({
      $,
      projectId: this.projectId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved project information for ID ${this.projectId}`);
    }

    return response;
  },
};