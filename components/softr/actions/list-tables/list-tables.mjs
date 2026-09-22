import softr from "../../softr.app.mjs";

export default {
  key: "softr-list-tables",
  name: "List Tables",
  description: "Retrieve a list of all tables in a database. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/tables/get-tables)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    softr,
    databaseId: {
      propDefinition: [
        softr,
        "databaseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.listTables({
      $,
      databaseId: this.databaseId,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} table${response.data.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
