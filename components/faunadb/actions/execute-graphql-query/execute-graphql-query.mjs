import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-execute-graphql-query",
  name: "Execute GraphQL Query",
  description: "Performs an arbitrary authorized GraphQL query",
  version: "0.0.1",
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
    const response = await this.faunadb.executeGraphqlQuery(this.query);

    $.export("summary", "Successfully executed graphql query");

    return response;
  },
};
