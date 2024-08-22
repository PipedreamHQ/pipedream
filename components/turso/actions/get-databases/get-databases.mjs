import app from "../../turso.app.mjs";

export default {
  key: "turso-get-databases",
  name: "Get Databases",
  description: "Returns a list of databases belonging to the organization or user. [See the documentation](https://docs.turso.tech/api-reference/databases/list)",
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
  },
  async run({ $ }) {
    const response = await this.app.getDatabases({
      $,
      organizationName: this.organizationName,
    });

    $.export("$summary", `Successfully retrieved '${response.databases.length}' database(s)`);

    return response;
  },
};
