import { gql } from "graphql-request";

/**
 * Get app uninstall events via app.AppEventConnection relationship
 * https://shopify.dev/api/partner/reference/apps/appeventconnection
 */
export default gql`
  query getAppInstalls(
    $appId: ID!
    $occurredAtMin: DateTime
    $occurredAtMax: DateTime
    $cursor: String
  ) {
    app(id: $appId) {
      events(
        types: [RELATIONSHIP_UNINSTALLED]
        occurredAtMin: $occurredAtMin
        occurredAtMax: $occurredAtMax
        after: $cursor
        first: 50
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            occurredAt
            __typename
            ... on RelationshipUninstalled {
              reason
              description
              app {
                id
                name
              }
              shop {
                avatarUrl
                id
                myshopifyDomain
                name
              }
            }
          }
        }
      }
    }
  }
`;
