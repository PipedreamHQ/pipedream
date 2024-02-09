import { gql } from "graphql-request";

/**
 * Get app (name) by ID
 * https://shopify.dev/docs/api/partner/2024-01/queries/app
 */
export default gql`
  query getAppInstalls(
    $appId: ID!
  ) {
    app(id: $appId) {
      name
    }
  }
`;
