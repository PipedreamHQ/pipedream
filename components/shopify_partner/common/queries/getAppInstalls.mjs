import { gql } from "graphql-request";

/**
 * Get app install events via app.AppEventConnection relationship
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
        types: [RELATIONSHIP_INSTALLED]
        occurredAtMin: $occurredAtMin
        occurredAtMax: $occurredAtMax
        after: $after
        first: 50
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          id
          cursor
          node {
            occurredAt
            __typename
            ... on RelationshipInstalled {
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
