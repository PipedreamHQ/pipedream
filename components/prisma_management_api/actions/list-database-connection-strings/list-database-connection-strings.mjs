import app from "../../prisma_management_api.app.mjs";

export default {
  name: "List Database Connection Strings",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prisma_management_api-list-database-connection-strings",
  description: "Retrieves a list of all connection strings for a specific database via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the database to list connections for",
    },
  },
  async run({ $ }) {
    const response = await this.app.listConnectionStrings({
      $,
      databaseId: this.databaseId,
    });

    if (response) {
      const count = response.data?.length || 0;
      $.export("$summary", `Successfully retrieved ${count} connection${count !== 1 ? "s" : ""} for database ${this.databaseId}`);
    }

    return response;
  },
};