import nile from "../../nile_database.app.mjs";

export default {
  name: "Execute Query",
  key: "nile_database-execute-query",
  description: "Execute a custom PostgreSQL query.",
  version: "0.0.1",
  type: "action",
  props: {
    nile,
    user: {
      type: "string",
      label: "Username",
      description: "The username of the database user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the database user",
    },
    host: {
      type: "string",
      label: "Host",
      description: "The host of the database",
    },
    port: {
      type: "string",
      label: "Port",
      description: "The port to connect to the database. Example: `5432`",
    },
    database: {
      propDefinition: [
        nile,
        "database",
      ],
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
      host: this.host,
      port: this.port,
      database: this.database,
    };
    const data = await this.nile.executeQuery(config, this.query);
    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);
    return data;
  },
};
