import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Delete Database by Database ID",
  version: "1.0.0",
  key: "prisma_management_api-delete-database-by-database-id",
  description: "Delete a specific database by Database ID via Prisma Management API. This action is irreversible. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the database to delete",
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDatabase({
      $,
      databaseId: this.databaseId,
    });

    if (response || response === null) {
      $.export("$summary", `Successfully deleted database with ID ${this.databaseId}`);
    }

    return {
      success: true,
      databaseId: this.databaseId,
      message: "Database deleted successfully",
    };
  },
};