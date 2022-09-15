import { gql } from "graphql-request";

/**
 * Get app relationship events via app.AppEventConnection relationship
 * https://shopify.dev/api/partner/reference/apps/appeventconnection
 */
export default gql`
  query getAppRelationshipEventsForwards(
    $appId: ID!
    $occurredAtMin: DateTime
    $occurredAtMax: DateTime
    $before: String
    $recordsPerRun: Int
  ) {
    app(id: $appId) {
      events(
        types: [RELATIONSHIP_INSTALLED, RELATIONSHIP_UNINSTALLED, RELATIONSHIP_DEACTIVATED, SUBSCRIPTION_CHARGE_ACCEPTED, SUBSCRIPTION_CHARGE_ACTIVATED, SUBSCRIPTION_CHARGE_CANCELED, SUBSCRIPTION_CHARGE_DECLINED, SUBSCRIPTION_CHARGE_FROZEN, 
SUBSCRIPTION_CHARGE_UNFROZEN]
        occurredAtMin: $occurredAtMin
        occurredAtMax: $occurredAtMax
        before: $before
        last: $recordsPerRun
      ) {
        pageInfo {
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
            ... on RelationshipDeactivated {
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
            ... on RelationshipReactivated {
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
            ... on SubscriptionChargeAccepted {
              app {
                id
                name
              }
              charge {
                amount {
                  currencyCode
                  amount
                }
                billingOn
                id
                name
                test
              }
              shop {
                avatarUrl
                id
                myshopifyDomain
                name
              }
            }
            ... on SubscriptionChargeActivated {
              app {
                id
                name
              }
              charge {
                amount {
                  currencyCode
                  amount
                }
                billingOn
                id
                name
                test
              }
              shop {
                avatarUrl
                id
                myshopifyDomain
                name
              }
            }
            ... on SubscriptionChargeCanceled {
              app {
                id
                name
              }
              charge {
                amount {
                  currencyCode
                  amount
                }
                billingOn
                id
                name
                test
              }
              shop {
                avatarUrl
                id
                myshopifyDomain
                name
              }
            }
            ... on SubscriptionChargeDeclined {
              app {
                id
                name
              }
              charge {
                amount {
                  currencyCode
                  amount
                }
                billingOn
                id
                name
                test
              }
              shop {
                avatarUrl
                id
                myshopifyDomain
                name
              }
            }
            ... on SubscriptionChargeFrozen {
              app {
                id
                name
              }
              charge {
                amount {
                  currencyCode
                  amount
                }
                billingOn
                id
                name
                test
              }
              shop {
                avatarUrl
                id
                myshopifyDomain
                name
              }
            }
            ... on SubscriptionChargeUnfrozen {
              app {
                id
                name
              }
              charge {
                amount {
                  currencyCode
                  amount
                }
                billingOn
                id
                name
                test
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
