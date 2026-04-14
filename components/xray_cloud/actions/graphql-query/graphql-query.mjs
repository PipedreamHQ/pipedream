import xrayCloud from "../../xray_cloud.app.mjs";

export default {
  key: "xray_cloud-graphql-query",
  name: "GraphQL Query",
  description:
    "Run an arbitrary GraphQL query against the Xray Cloud API. [See the schema](https://us.xray.cloud.getxray.app/doc/graphql/index.html)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    xrayCloud,
    query: {
      type: "string",
      label: "GraphQL Query",
      description: "The GraphQL query to execute against Xray Cloud",
    },
    variables: {
      type: "string",
      label: "Variables (JSON)",
      description: "JSON string of query variables",
      optional: true,
    },
  },
  async run({ $ }) {
    let variables = {};
    if (this.variables) {
      try {
        const parsed = JSON.parse(this.variables);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Variables must be a JSON object");
        }
        variables = parsed;
      } catch (err) {
        throw new Error(`Invalid variables JSON: ${err.message}`);
      }
    }
    const response = await this.xrayCloud._makeGraphqlRequest({
      $,
      query: this.query,
      variables,
    });
    $.export("$summary", "Successfully executed GraphQL query");
    return response;
  },
};
