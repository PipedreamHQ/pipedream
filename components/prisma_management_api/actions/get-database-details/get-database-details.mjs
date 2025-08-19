import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Get Database details",
  version: "1.0.0",
  key: "prisma_management_api-get-database-details",
  description: "Get database details of a particular Prisma Postgres database via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the database to retrieve information for",
    },
  },
  async run({ $ }) {
    const response = await this.app.getDatabase({
      $,
      databaseId: this.databaseId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved database information for ID ${this.databaseId}`);
    }

    return response;
  },
};