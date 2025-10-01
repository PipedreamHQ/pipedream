import app from "../../prisma_management_api.app.mjs";

export default {
  name: "List Databases from Project",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prisma_management_api-list-databases-from-project",
  description: "Retrieves a list of all databases within a specific Prisma project. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to list databases from",
    },
  },
  async run({ $ }) {
    const response = await this.app.listDatabases({
      $,
      projectId: this.projectId,
    });

    if (response) {
      const count = response.data?.length || 0;
      $.export("$summary", `Successfully retrieved ${count} database${count !== 1 ? "s" : ""} from project ${this.projectId}`);
    }

    return response;
  },
};