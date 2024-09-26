import app from "../../turso.app.mjs";

export default {
  key: "turso-create-database",
  name: "Create Database",
  description: "Creates a new database in a group for the organization or user. [See the documentation](https://docs.turso.tech/api-reference/databases/create)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    organizationName: {
      propDefinition: [
        app,
        "organizationName",
      ],
    },
    groupName: {
      propDefinition: [
        app,
        "groupName",
        (c) => ({
          organizationName: c.organizationName,
        }),
      ],
    },
    databaseName: {
      propDefinition: [
        app,
        "databaseName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createDatabase({
      $,
      organizationName: this.organizationName,
      data: {
        name: this.databaseName,
        groupName: this.groupName,
      },
    });

    $.export("$summary", `Successfully created the database '${this.databaseName}'`);

    return response;
  },
};
