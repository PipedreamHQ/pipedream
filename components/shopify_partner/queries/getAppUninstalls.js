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
        types: [RELATIONSHIP_UNINSTALLED]
        occurredAtMin: $occurredAtMin
        occurredAtMax: $occurredAtMax
        after: $after
      ) {
        edges {
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

module.exports = query;
