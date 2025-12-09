const searchCustomers = `
  query Search($input: CustomerSearchInput!,) {
    search {
      customers(input: $input) {
        edges {
          node {
            id
            firstName
            lastName
            company
            email
            phoneNumber
            fax
            website
            createdAt
            customFields {
              name
              value
            }
          }
        }
      }
    }
  }
`;

const searchTransactions = `
  query ($input: TransactionSearchInput!) {
    search {
      transactions(input: $input) {
        edges {
          node {
            id
            status
            amount {
              value
              currencyCode
            }
            paymentMethod {
              id
            }
            orderId
            merchantId
            merchantName
            customFields {
              name
              value
            }
            channel
            customer {
              id
            }
            lineItems {
              name
              quantity
              totalAmount
            }
            createdAt
          }
        }
      }
    }
  }
`;

export default {
  searchCustomers,
  searchTransactions,
};
