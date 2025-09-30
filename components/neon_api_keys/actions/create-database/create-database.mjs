import app from "../../neon_api_keys.app.mjs";

export default {
  name: "Create Database",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "neon_api_keys-create-database",
  description: "Creates a database in the project. [See docs here](https://api-docs.neon.tech/reference/createprojectbranchdatabase)",
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    branchId: {
      label: "Parent Branch ID",
      description: "The ID of the parent branch. If omitted or empty, the branch will be created from the project's primary branch.",
      propDefinition: [
        app,
        "branchId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    roleName: {
      propDefinition: [
        app,
        "roleName",
        (c) => ({
          branchId: c.branchId,
          projectId: c.projectId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The database name",
    },
  },
  async run({ $ }) {
    const response = await this.app.createDatabase({
      $,
      projectId: this.projectId,
      branchId: this.branchId,
      data: {
        database: {
          name: this.name,
          owner_name: this.roleName,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created database with ID ${response.database.id}`);
    }

    return response;
  },
};
