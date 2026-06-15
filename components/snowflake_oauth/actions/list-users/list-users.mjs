import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  key: "snowflake_oauth-list-users",
  name: "List Users",
  description: "List the users in the connected Snowflake account. Requires a role with privileges to run SHOW USERS (e.g. ACCOUNTADMIN or SECURITYADMIN); may return an empty list or error under a restricted OAuth role. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/show-users)",
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
    const users = await this.snowflake.listUsers();
    const names = users.map((i) => i.login_name);
    $.export("$summary", `Successfully retrieved ${names.length} user${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
