const CREATE_ORDER = `
 mutation OrderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
      orderCreate(order: $order, options: $options) {
        userErrors {
          field
          message
        }
        order {
          id
          totalTaxSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 5) {
            nodes {
              variant {
                id
              }
              id
              title
              quantity
              taxLines {
                title
                rate
                priceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
`;

const CREATE_CUSTOMER = `
  mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          email
          phone
          taxExempt
          firstName
          lastName
          amountSpent {
            amount
            currencyCode
          }
          smsMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
        }
      }
    }
`;

const UPDATE_CUSTOMER = `
  mutation updateCustomerMetafields($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        metafields(first: 3) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`;

const UPDATE_PRODUCT = `
  mutation UpdateProductWithNewMedia($input: ProductInput!, $media: [CreateMediaInput!]) {
      productUpdate(input: $input, media: $media) {
        product {
          id
          media(first: 10) {
            nodes {
              alt
              mediaContentType
              preview {
                status
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
`;

const REFUND_ORDER = `
mutation RefundLineItem($input: RefundInput!) {
    refundCreate(input: $input) {
      refund {
        id
        totalRefundedSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
        order {
          id
          totalPriceSet {
            presentmentMoney {
              amount
              currencyCode
            }
          }
        }
        refundLineItems(first: 10) {
            nodes {
              id
              lineItem {
                id
                title
                quantity
                product {
                  id
                  title
                }
                variant {
                  id
                  title
                  price
                }
              }
            }
          }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_FULFILLMENT_TRACKING_INFO = `
  mutation FulfillmentTrackingInfoUpdate($fulfillmentId: ID!, $trackingInfoInput: FulfillmentTrackingInput!, $notifyCustomer: Boolean) {
    fulfillmentTrackingInfoUpdate(fulfillmentId: $fulfillmentId, trackingInfoInput: $trackingInfoInput, notifyCustomer: $notifyCustomer) {
      fulfillment {
        id
        status
        trackingInfo {
          company
          number
          url
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_FULFILLMENT = `
mutation fulfillmentCreate($fulfillment: FulfillmentInput!, $message: String) {
  fulfillmentCreate(fulfillment: $fulfillment, message: $message) {
    fulfillment {
      id
      name
      status
      createdAt
    }
    userErrors {
      field
      message
    }
  }
}
`;

export default {
  CREATE_ORDER,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  UPDATE_PRODUCT,
  REFUND_ORDER,
  UPDATE_FULFILLMENT_TRACKING_INFO,
  CREATE_FULFILLMENT,
};
