import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Delete Database Connection String",
  version: "1.0.0",
  key: "prisma_management_api-delete-database-connection-string",
  description: "Deletes a specific database connection string via Prisma Management API. This action is irreversible. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    connectionId: {
      type: "string",
      label: "Connection ID",
      description: "The ID of the database connection to delete",
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteConnectionString({
      $,
      connectionId: this.connectionId,
    });

    if (response || response === null) {
      $.export("$summary", `Successfully deleted database connection with ID ${this.connectionId}`);
    }

    return {
      success: true,
      connectionId: this.connectionId,
      message: "Database connection deleted successfully",
    };
  },
};