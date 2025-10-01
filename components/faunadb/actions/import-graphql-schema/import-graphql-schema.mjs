import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-import-graphql-schema",
  name: "Import GraphQL schema",
  description: "Import graphQL schema to a database. [See docs here](https://docs.fauna.com/fauna/current/api/graphql/endpoints#import)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    faunadb,
    schema: {
      label: "Schema",
      description: "The GraphQL schema to import",
      type: "string",
    },
  },
  async run({ $ }) {
    const { schema } = this;

    const response = await this.faunadb.importGraphqlSchema({
      schema,
      $,
    });

    $.export("$summary", "Successfully imported graphql schema");

    return response;
  },
};
