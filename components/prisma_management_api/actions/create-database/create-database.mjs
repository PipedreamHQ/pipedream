import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Create Database",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "prisma_management_api-create-database",
  description: "Creates a new Postgres database project via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the Postgres database project to create",
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
      default: "us-east-1",
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        name: this.name,
        region: this.region,
      },
    });

    if (response) {
      const projectId = response.data?.id;
      const databaseId = response.data?.database?.id;
      
      let summary = `Successfully created Postgres database project "${this.name}"`;
      if (projectId) {
        summary += ` with Project ID ${projectId}`;
      }
      if (databaseId) {
        summary += ` and Database ID ${databaseId}`;
      }
      
      $.export("$summary", summary);
    }

    return response;
  },
};