const { gql } = require("graphql-request");

const query = gql`
  query getTransactions($createdAtMin: DateTime, $createdAtMax: DateTime) {
    transactions(
      types: [APP_USAGE_SALE, APP_ONE_TIME_SALE, APP_SUBSCRIPTION_SALE]
      createdAtMin: $createdAtMin
      createdAtMax: $createdAtMax
    ) {
      edges {
        node {
          id
          createdAt
          __typename
          ... on AppSubscriptionSale {
            app {
              id
              name
            }
            netAmount {
              amount
              currencyCode
            }
          }
          ... on AppUsageSale {
            app {
              id
              name
            }
            netAmount {
              amount
              currencyCode
            }
          }
          ... on AppOneTimeSale {
            app {
              id
              name
            }
            netAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

module.exports = query;
