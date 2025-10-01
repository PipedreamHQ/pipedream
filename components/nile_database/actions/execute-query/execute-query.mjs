import nile from "../../nile_database.app.mjs";

export default {
  name: "Execute Query",
  key: "nile_database-execute-query",
  description: "Execute a custom PostgreSQL query.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nile,
    workspace: {
      propDefinition: [
        nile,
        "workspace",
      ],
    },
    database: {
      propDefinition: [
        nile,
        "database",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    user: {
      type: "string",
      label: "Username",
      description: "The username or userId of the database user. Note: Credentials are generated in the Nile Dashboard under Settings -> Credentials",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the database user",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The PostgreSQL query to execute",
    },
  },
  async run({ $ }) {
    const config = {
      user: this.user,
      password: this.password,
      host: await this.nile.getHost({
        workspace: this.workspace,
        database: this.database,
      }),
      port: "5432",
      database: this.database,
    };
    const data = await this.nile.executeQuery(config, this.query);
    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);
    return data;
  },
};
