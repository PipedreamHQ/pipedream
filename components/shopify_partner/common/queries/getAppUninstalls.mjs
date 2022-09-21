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
    $after: String
  ) {
    app(id: $appId) {
      events(
        types: [RELATIONSHIP_UNINSTALLED]
        occurredAtMin: $occurredAtMin
        occurredAtMax: $occurredAtMax
        after: $after
        first: 50
      ) {
        edges {
          node {
            id
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
