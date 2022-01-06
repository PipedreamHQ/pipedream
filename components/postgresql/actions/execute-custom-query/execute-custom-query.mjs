import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Execute Custom Query",
  key: "postgresql-execute-custom-query",
  description: "Executes a custom query you provide. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.1",
  type: "action",
  props: {
    postgresql,
    query: {
      propDefinition: [
        postgresql,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.postgresql.executeQuery(this.query);
    $.export("$summary", "Successfully executed query");
    return res;
  },
};
