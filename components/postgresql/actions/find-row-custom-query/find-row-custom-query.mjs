import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Find Row Custom Query",
  key: "postgresql-find-row-custom-query",
  description: "Finds a row in a table via a custom query you control. [See Docs](https://node-postgres.com/features/queries)",
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
    const summary = res[0]
      ? "Row found"
      : "Row not found";
    $.export("$summary", summary);
    return res[0];
  },
};
