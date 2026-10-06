import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shopify-run-graphql-query",
  name: "Run GraphQL Query",
  description: "Run a read-only Admin GraphQL query against the store and return its `data` object."
    + " Use this to read fields or resources that no other Shopify action exposes, e.g. shop settings, markets, or custom field selections on orders and products."
    + " Only queries are accepted — documents containing a mutation or subscription are rejected; use the dedicated create/update actions or **Run Bulk Mutation** to write data."
    + " Connections are paginated: request `first` (max `250`) and `pageInfo { hasNextPage endCursor }`, then pass `endCursor` as `after` in the next call."
    + " For exports of thousands of records, use **Run Bulk Query** instead."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopify,
    query: {
      type: "string",
      label: "Query",
      description: "The Admin GraphQL query document. Must contain only query operations. Example: `query ($first: Int!) { orders(first: $first, sortKey: CREATED_AT, reverse: true) { nodes { id name totalPriceSet { shopMoney { amount currencyCode } } } pageInfo { hasNextPage endCursor } } }`",
    },
    variables: {
      type: "string",
      label: "Variables",
      description: "A JSON object of values for the variables declared in **Query**, e.g. `{\"first\": 50}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    let operationTypes;
    try {
      operationTypes = utils.getOperationTypes(this.query);
    } catch (err) {
      throw new ConfigurationError(`**Query** is not a valid GraphQL document: ${err.message}`);
    }
    if (operationTypes.some((operationType) => operationType !== "query")) {
      throw new ConfigurationError("**Query** must contain only query operations. Use the dedicated create/update actions or **Run Bulk Mutation** to write data.");
    }

    const variables = utils.parseJson(this.variables);
    if (variables !== undefined
      && (typeof variables !== "object" || Array.isArray(variables))) {
      throw new ConfigurationError("**Variables** must be a JSON object, e.g. `{\"first\": 50}`");
    }

    const response = await this.shopify.runGraphQlQuery({
      query: this.query,
      variables,
    });

    $.export("$summary", "Successfully ran GraphQL query");
    return response;
  },
};
