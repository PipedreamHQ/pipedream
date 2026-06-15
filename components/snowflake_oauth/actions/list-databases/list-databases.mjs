import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  key: "snowflake_oauth-list-databases",
  name: "List Databases",
  description: "List the databases available to the connected Snowflake account. Use the returned names in the Database field of other actions. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/show-databases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    snowflake,
  },
  async run({ $ }) {
    const databases = await this.snowflake.listDatabases();
    const names = databases.map((i) => i.name);
    $.export("$summary", `Successfully retrieved ${names.length} database${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
