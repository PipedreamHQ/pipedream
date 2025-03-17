const GET_ORDER = `
  query SuggestedRefund($id: ID!, $refundLineItems: [RefundLineItemInput!], $first: Int, $after: String) {
    order(id: $id) {
      id
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
      suggestedRefund(refundLineItems: $refundLineItems) {
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
        refundLineItems {
          lineItem {
            id
          }
          quantity
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

const LIST_ORDERS = `
  query ($first: Int, $after: String, $reverse: Boolean){
    orders(first: $first, after: $after, reverse: $reverse) {
      nodes {
        id
        updatedAt
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

export default {
  GET_ORDER,
  GET_CUSTOMER,
  GET_DRAFT_ORDER,
  LIST_ORDERS,
  LIST_DRAFT_ORDERS,
  LIST_CUSTOMERS,
};
