const { gql } = require("graphql-request");

const query = gql`
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

module.exports = query;
