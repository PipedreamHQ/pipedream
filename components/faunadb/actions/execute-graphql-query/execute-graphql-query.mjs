import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-execute-graphql-query",
  name: "Execute GraphQL Query",
  description: "Performs an arbitrary authorized GraphQL query. [See docs here](https://docs.fauna.com/fauna/current/api/graphql/endpoints#graphql)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    faunadb,
    query: {
      label: "Query",
      description: "A GraphQL query to execute",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.faunadb.executeGraphqlQuery(this.query, $);

    $.export("$summary", "Successfully executed graphql query");

    return response;
  },
};
