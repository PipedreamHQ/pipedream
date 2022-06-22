import { gql } from "graphql-request";

/**
 * Get all transactions via TransactionsConnections relationship
 * https://shopify.dev/api/partner/reference/transactions/transactionconnection
 */
export default gql`
  query getTransactions(
    $createdAtMin: DateTime
    $createdAtMax: DateTime
    $after: String
  ) {
    transactions(
      types: [APP_USAGE_SALE, APP_ONE_TIME_SALE, APP_SUBSCRIPTION_SALE]
      createdAtMin: $createdAtMin
      createdAtMax: $createdAtMax
      after: $after
      first: 100
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
            shop {
              avatarUrl
              id
              name
              myshopifyDomain
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
            shop {
              avatarUrl
              id
              name
              myshopifyDomain
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
            shop {
              avatarUrl
              id
              name
              myshopifyDomain
            }
          }
        }
      }
    }
  }
`;
