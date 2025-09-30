import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Delete Database",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "prisma_management_api-delete-database",
  description: "Deletes a Postgres database project via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the Postgres database project to delete",
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteProject({
      $,
      projectId: this.projectId,
    });

    if (response || response === null) {
      $.export("$summary", `Successfully deleted Postgres database project with ID ${this.projectId}`);
    }

    return {
      success: true,
      projectId: this.projectId,
      message: "Database project deleted successfully",
    };
  },
};