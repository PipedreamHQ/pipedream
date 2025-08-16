import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Create New Database in Existing Project",
  version: "0.1.0",
  key: "prisma_management_api-create-new-database-in-existing-project",
  description: "Create a new database in an existing Prisma project. Requires Project ID. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project where the database should be created",
    },
    region: {
      type: "string",
      label: "Region",
      description: "The AWS region where the database should be created",
      options: [
        "us-east-1",
        "us-west-1",
        "eu-west-3",
        "eu-central-1",
        "ap-northeast-1",
        "ap-southeast-1",
      ],
      optional: true,
    },
    isDefault: {
      type: "boolean",
      label: "Set as Default Database",
      description: "Whether to set this database as the default for the project",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.region) data.region = this.region;
    if (this.isDefault !== undefined) data.default = this.isDefault;

    const response = await this.app.createDatabase({
      $,
      projectId: this.projectId,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully created database in project ${this.projectId}${response.id ? ` with ID ${response.id}` : ""}`);
    }

    return response;
  },
};