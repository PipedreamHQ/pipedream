import softr from "../../softr.app.mjs";

export default {
  key: "softr-list-databases",
  name: "List Databases",
  description: "Retrieve a list of all databases accessible to the authenticated user. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/databases/get-databases)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    softr,
  },
  async run({ $ }) {
    const response = await this.softr.listDatabases({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} database${response.data.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
