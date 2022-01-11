import { gql } from "graphql-request";

/**
 * Get all transactions via TransactionsConnections relationship
 * https://shopify.dev/api/partner/reference/transactions/transactionconnection
 */
export default gql`
  query getTransactions(
    $after: String = null
  ) {
    transactions(
      types: [APP_USAGE_SALE, APP_ONE_TIME_SALE, APP_SUBSCRIPTION_SALE]
      after: $after
      first: 50
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
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
