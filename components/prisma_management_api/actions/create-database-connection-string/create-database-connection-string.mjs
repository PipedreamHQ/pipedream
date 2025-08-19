import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Create Database Connection String",
  version: "1.0.0",
  key: "prisma_management_api-create-database-connection-string",
  description: "Creates a new connection string for an existing database via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the database to create a connection string for",
    },
    name: {
      type: "string",
      label: "Connection Name",
      description: "A descriptive name for the connection string",
    },
  },
  async run({ $ }) {
    const response = await this.app.createConnectionString({
      $,
      databaseId: this.databaseId,
      data: {
        name: this.name,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created connection string for database ${this.databaseId}${response.id ? ` with connection ID ${response.id}` : ""}`);
    }

    return response;
  },
};