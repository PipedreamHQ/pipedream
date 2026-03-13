const GET_ORDER = `
  query GetOrder($id: ID!, $first: Int, $after: String) {
    order(id: $id) {
      id
      name
      createdAt
      updatedAt
      processedAt
      cancelledAt
      cancelReason
      closedAt
      confirmed
      note
      tags
      test
      currencyCode
      displayFinancialStatus
      displayFulfillmentStatus
      closed
      requiresShipping
      riskLevel
      customerAcceptsMarketing
      paymentGatewayNames
      
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
        presentmentMoney {
          amount
          currencyCode
        }
      }
      
      subtotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
        presentmentMoney {
          amount
          currencyCode
        }
      }
      
      currentTotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
        presentmentMoney {
          amount
          currencyCode
        }
      }
      
      totalDiscountsSet {
        shopMoney {
          amount
          currencyCode
        }
        presentmentMoney {
          amount
          currencyCode
        }
      }
      
      totalShippingPriceSet {
        shopMoney {
          amount
          currencyCode
        }
        presentmentMoney {
          amount
          currencyCode
        }
      }
      
      totalTaxSet {
        shopMoney {
          amount
          currencyCode
        }
        presentmentMoney {
          amount
          currencyCode
        }
      }
      
      customer {
        id
        displayName
        firstName
        lastName
        email
        phone
        note
        createdAt
        updatedAt
        verifiedEmail
        tags
        defaultAddress {
          id
          address1
          address2
          city
          province
          zip
          country
          countryCodeV2
          company
          firstName
          lastName
          phone
        }
      }
      
      billingAddress {
        address1
        address2
        city
        province
        zip
        country
        countryCodeV2
        company
        firstName
        lastName
        phone
      }
      
      shippingAddress {
        address1
        address2
        city
        province
        zip
        country
        countryCodeV2
        company
        firstName
        lastName
        phone
      }
      
      lineItems(first: 250) {
        edges {
          node {
            id
            title
            quantity
            variantTitle
            vendor
            fulfillmentStatus
            fulfillableQuantity
            refundableQuantity
            requiresShipping
            restockable
            
            originalUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
              presentmentMoney {
                amount
                currencyCode
              }
            }
            
            discountedUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
              presentmentMoney {
                amount
                currencyCode
              }
            }
            
            totalDiscountSet {
              shopMoney {
                amount
                currencyCode
              }
              presentmentMoney {
                amount
                currencyCode
              }
            }
            
            variant {
              id
              title
              sku
              barcode
              inventoryItem {
                id
                measurement {
                  weight {
                    value
                    unit
                  }
                }
              }
              inventoryQuantity
              price
              compareAtPrice
              availableForSale
              image {
                url
                altText
              }
            }
            
            product {
              id
              title
              handle
              vendor
              productType
              tags
              status
              createdAt
              updatedAt
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
            
            taxLines {
              title
              rate
              ratePercentage
              priceSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
            }
            
            discountAllocations {
              allocatedAmountSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              discountApplication {
                ... on DiscountCodeApplication {
                  code
                }
                ... on AutomaticDiscountApplication {
                  title
                }
                ... on ManualDiscountApplication {
                  title
                  description
                }
              }
            }
          }
        }
      }
      
      shippingLine {
        title
        code
        source
        carrierIdentifier
        requestedFulfillmentService {
          id
          serviceName
          handle
        }
        deliveryCategory
        originalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        discountedPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        taxLines {
          title
          rate
          ratePercentage
          priceSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }
        }
      }
      
      fulfillments {
        id
        status
        displayStatus
        createdAt
        updatedAt
        estimatedDeliveryAt
        inTransitAt
        deliveredAt
        service {
          id
          serviceName
          handle
        }
        fulfillmentLineItems(first: 250) {
          edges {
            node {
              id
              quantity
              lineItem {
                id
                title
              }
            }
          }
        }
      }
      
      transactions(first: 250) {
        id
        status
        kind
        gateway
        test
        createdAt
        processedAt
        amountSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        fees {
          amount {
            amount
            currencyCode
          }
          flatFee {
            amount
            currencyCode
          }
          rate
          rateName
          type
        }
      }
      
      refunds {
        id
        createdAt
        note
        totalRefundedSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        refundLineItems(first: 250) {
          edges {
            node {
              id
              quantity
              restockType
              location {
                id
                name
              }
              lineItem {
                id
                title
                quantity
              }
              subtotalSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              totalTaxSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        transactions {
          nodes {
            id
            status
            kind
            gateway
            amountSet {
              shopMoney {
                amount
                currencyCode
              }
              presentmentMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
      
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_CUSTOMER = `
  query ($id: ID!, $first: Int, $after: String) {
    customer(id: $id) {
      id
      firstName
      lastName
      email
      phone
      numberOfOrders
      amountSpent {
        amount
        currencyCode
      }
      createdAt
      updatedAt
      note
      verifiedEmail
      validEmailAddress
      tags
      lifetimeDuration
      defaultAddress {
        formattedArea
        address1
      }
      addresses {
        address1
      }
      image {
        src
      }
      canDelete
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_DRAFT_ORDER = `
  query ($id: ID!, $first: Int, $after: String) {
    draftOrder(id: $id) {
      name
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_FULFILLMENT_ORDER = `
  query LocationsForMoveList($fulfillmentOrderId: ID!, $first: Int) {
    fulfillmentOrder(id: $fulfillmentOrderId) {
      lineItems (first: $first) {
        nodes {
          id
        }
      }
    }
  }
`;

const LIST_ORDERS = `
  query ($first: Int, $after: String, $reverse: Boolean, $query: String, $sortKey: OrderSortKeys){
    orders(first: $first, after: $after, reverse: $reverse, query: $query, sortKey: $sortKey) {
      nodes {
        id
        name
        createdAt
        updatedAt
        processedAt
        currencyCode
        displayFinancialStatus
        displayFulfillmentStatus
        closed
        confirmed
        test
        note
        tags
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        subtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        totalTaxSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          firstName
          lastName
          email
          phone
          defaultAddress {
            id
            address1
            address2
            city
            province
            zip
            country
            company
          }
        }
        shippingAddress {
          address1
          address2
          city
          province
          zip
          country
          company
          firstName
          lastName
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              variantTitle
              vendor
              fulfillmentStatus
              originalUnitPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              variant {
                id
                title
                sku
                price
                image {
                  url
                  altText
                }
              }
              product {
                id
                title
                handle
                vendor
                productType
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        fulfillments {
          id
          status
          displayStatus
        }
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const LIST_DRAFT_ORDERS = `
  query ($first: Int, $after: String){
    draftOrders(first: $first, after: $after) {
      nodes {
        id
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_CUSTOMERS = `
  query ($first: Int, $after: String, $query: String) {
    customers(first: $first, after: $after, query: $query) {
      nodes {
        id
        displayName
        email
        phone
        addresses (first: $first) {
          address1
          address2
          city
          country
          company
        }
        orders (first: $first) {
          nodes {
            id
            createdAt
          }
        }
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_FULFILLMENT_ORDERS = `
  query ($first: Int, $after: String, $query: String) {
    fulfillmentOrders(first: $first, after: $after, query: $query) {
      nodes {
        id
        status
        createdAt
        updatedAt
        fulfillAt
        orderId
        orderName
        fulfillments (first: $first) {
          nodes {
            id
            name
          }
        }
        lineItems (first: $first) {
          nodes {
            id
            productTitle
            totalQuantity
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export default {
  GET_ORDER,
  GET_CUSTOMER,
  GET_DRAFT_ORDER,
  GET_FULFILLMENT_ORDER,
  LIST_ORDERS,
  LIST_DRAFT_ORDERS,
  LIST_CUSTOMERS,
  LIST_FULFILLMENT_ORDERS,
};
